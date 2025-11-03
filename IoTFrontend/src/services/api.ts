import axios from 'axios';
import { SensorRecord } from '../types';

type Filters = { fromDate?: Date; toDate?: Date; sensorType?: string; instance?: string };

const base = ((import.meta as any)?.env?.VITE_API_BASE as string) || 'http://localhost:8080/api';

async function fetchFrom<T>(path: string, params: any = {}): Promise<T[]> {
	const res = await axios.get<T[]>(`${base}${path}`, { params });
	return res.data;
}

export async function fetchSensors(filters: Filters): Promise<SensorRecord[]> {
	const { sensorType, instance, fromDate, toDate } = filters;

	const params: any = {};
	if (fromDate) params.fromDate = fromDate.toISOString();
	if (toDate) params.toDate = toDate.toISOString();

	if (sensorType && sensorType !== 'all') {
		const path = `/sensors/${sensorType}${instance && instance !== 'all' ? `/${instance}` : ''}`;
		return await fetchFrom<SensorRecord>(path, params);
	}

	const groups = ['environmental', 'battery', 'drive-system', 'vehicle-dynamic'];
	const results: SensorRecord[] = [];
	await Promise.all(
		groups.map(async g => {
			const path = `/sensors/${g}${instance && instance !== 'all' ? `/${instance}` : ''}`;
			const r = await fetchFrom<SensorRecord>(path, params);
			results.push(...r);
		})
	);
	// sort by timestamp desc
	results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	return results;
}

export async function fetchLastRecords(
	sensorType: string,
	instance: string | undefined,
	limit = 100
): Promise<SensorRecord[]> {
	function normalizeForRoute(t: string) {
		if (!t) return t;
		const key = t.toLowerCase().replace(/[^a-z0-9]/g, '');
		const map: Record<string, string> = {
			batterysensor: 'battery',
			battery: 'battery',
			environmentalsensor: 'environmental',
			environmental: 'environmental',
			drivesystemsensor: 'drive-system',
			drivesystem: 'drive-system',
			drivesystemssensor: 'drive-system',
			vehicledynamicssensor: 'vehicle-dynamic',
			vehicledynamicsensor: 'vehicle-dynamic',
			vehicledynamic: 'vehicle-dynamic',
			vehicledynamics: 'vehicle-dynamic',
			'vehicle-dynamic': 'vehicle-dynamic',
		};
		return map[key] ?? t;
	}

	const routeType = normalizeForRoute(sensorType);
	const path = `/sensors/${routeType}${instance && instance !== 'all' ? `/${instance}` : ''}`;
	const res = await axios.get<SensorRecord[]>(`${base}${path}`);
	const data = res.data || [];

	data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	return data.slice(0, limit);
}

export type { Filters };
