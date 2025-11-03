import Papa from 'papaparse';
import { SensorRecord } from '../types';

export function exportToCsv(records: SensorRecord[]) {
	if (!records || records.length === 0) return;
	const rows = records.map(r => ({
		id: r.id,
		sensorId: r.sensorId,
		sensorType: r.sensorType,
		timestamp: r.timestamp,
		...r.data,
	}));
	const csv = Papa.unparse(rows);
	const blob = new Blob([csv], { type: 'text/csv' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'export.csv';
	a.click();
	URL.revokeObjectURL(url);
}

export function exportToJson(records: SensorRecord[]) {
	const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'export.json';
	a.click();
	URL.revokeObjectURL(url);
}
