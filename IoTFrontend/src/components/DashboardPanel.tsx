import { useEffect, useMemo, useState } from 'react';

import SensorTypeModal from './SensorTypeModal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { fetchLastRecords } from '../services/api';
import { SensorRecord } from '../types';

export default function DashboardPanel({ records }: { records: SensorRecord[] }) {
	const preferredOrder = ['environmental', 'battery', 'drive-system', 'vehicle-dynamic'];

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
			vehicledynamicssensor: 'vehicle-dynamic',
			vehicledynamicsensor: 'vehicle-dynamic',
			vehicledynamic: 'vehicle-dynamic',
			vehicledynamics: 'vehicle-dynamic',
			'vehicle-dynamic': 'vehicle-dynamic',
		};
		return map[key] ?? key;
	}
	const sensorTypes = useMemo(() => Array.from(new Set(records.map(r => r.sensorType))), [records]);
	const [sensorTypeAverages, setSensorTypeAverages] = useState<Array<{ type: string; avg: Record<string, number> }>>(
		[]
	);
	const [expandedType, setExpandedType] = useState<string | null>(null);
	const [instanceAverages, setInstanceAverages] = useState<
		Record<string, Array<{ sensorId: string; avg: Record<string, number> }>>
	>({});
	const [modalInfo, setModalInfo] = useState<{ type: string; instance?: string } | null>(null);

	function computeAvgFromRecords(recs: SensorRecord[]) {
		if (!recs || recs.length === 0) return {} as Record<string, number>;
		const last100 = recs.slice(0, 100);
		const allKeys = Array.from(new Set(last100.flatMap(r => Object.keys(r.data))));
		const avg: Record<string, number> = {};
		allKeys.forEach(k => {
			const vals = last100.map(r => {
				const v = Number((r.data as any)[k]);
				return isNaN(v) ? 0 : v;
			});
			avg[k] = vals.reduce((s, v) => s + v, 0) / vals.length;
		});
		return avg;
	}

	useEffect(() => {
		let mounted = true;
		let t: any = null;

		async function loadTypes() {
			try {
				const promises = sensorTypes.map(async type => {
					const recs = await fetchLastRecords(type, 'all', 100);
					const avg = computeAvgFromRecords(recs);
					return { type, avg };
				});
				let out = await Promise.all(promises);

				out = out.sort((a, b) => {
					const ka = normalizeForRoute(String(a.type));
					const kb = normalizeForRoute(String(b.type));
					const ia = preferredOrder.indexOf(ka);
					const ib = preferredOrder.indexOf(kb);
					if (ia === -1 && ib === -1) return String(a.type).localeCompare(String(b.type));
					if (ia === -1) return 1;
					if (ib === -1) return -1;
					return ia - ib;
				});
				if (mounted) setSensorTypeAverages(out);
			} catch (e) {
				// ignore
			}
		}

		loadTypes();
		t = setInterval(() => loadTypes(), 1000);
		return () => {
			mounted = false;
			if (t) clearInterval(t);
		};
	}, [sensorTypes]);

	useEffect(() => {
		if (!expandedType) return;
		let mounted = true;
		let t: any = null;

		async function loadInstances() {
			try {
				const type = expandedType as string;
				let instances = Array.from(new Set(records.filter(r => r.sensorType === type).map(r => r.sensorId)));
				instances = [...instances].sort();
				instances = instances.slice(0, 50);
				const promises = instances.map(async inst => {
					const recs = await fetchLastRecords(type, inst, 100);
					const avg = computeAvgFromRecords(recs);
					return { sensorId: inst, avg };
				});
				const out = await Promise.all(promises);
				if (mounted) setInstanceAverages(prev => ({ ...prev, [type]: out }));
			} catch (e) {
				// ignore
			}
		}

		loadInstances();
		t = setInterval(() => loadInstances(), 1000);
		return () => {
			mounted = false;
			if (t) clearInterval(t);
		};
	}, [expandedType, records]);

	return (
		<Box sx={{ width: '100%' }}>
			<Typography variant='h6' sx={{ mb: 1 }}>
				Dashboard (avg last 100) — SensorType view
			</Typography>

			<Grid container spacing={2} sx={{ mb: 2 }}>
				{sensorTypeAverages.map(st => {
					const keys = Object.keys(st.avg);
					const isExpanded = expandedType === st.type;
					return (
						<Grid item component={'div' as any} xs={12} sm={6} md={3} key={st.type}>
							<Card
								variant='outlined'
								sx={{ cursor: 'pointer' }}
								onClick={() => setExpandedType(isExpanded ? null : st.type)}>
								<CardHeader title={st.type} titleTypographyProps={{ variant: 'subtitle2' }} />
								<Divider />
								<CardContent
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										py: 3,
									}}>
									{keys.length ? (
										<>
											{keys.map(k => (
												<div key={k} style={{ textAlign: 'center' }}>
													<Typography variant='h6'>{Number(st.avg[k] ?? 0).toFixed(2)}</Typography>
													<Typography variant='caption' sx={{ mt: 0.5 }}>
														{k} (avg)
													</Typography>
												</div>
											))}
										</>
									) : (
										<Typography variant='body2'>No data</Typography>
									)}
								</CardContent>
							</Card>

							{isExpanded && (
								<Box sx={{ mt: 1 }}>
									<Typography variant='subtitle2' sx={{ mb: 1 }}>
										Instances for {st.type}
									</Typography>
									<Grid container spacing={1}>
										{(instanceAverages[st.type] || []).map(inst => {
											const keysI = Object.keys(inst.avg);
											return (
												<Grid item component={'div' as any} xs={6} sm={4} md={3} key={inst.sensorId}>
													<Card
														variant='outlined'
														sx={{ cursor: 'pointer' }}
														onClick={() => setModalInfo({ type: st.type, instance: inst.sensorId })}>
														<CardContent
															sx={{
																display: 'flex',
																flexDirection: 'column',
																alignItems: 'center',
																justifyContent: 'center',
																py: 2,
															}}>
															<Typography variant='subtitle2'>{inst.sensorId}</Typography>
															{keysI.length ? (
																keysI.map(k => (
																	<div key={k} style={{ textAlign: 'center' }}>
																		<Typography variant='body2'>{k}</Typography>
																		<Typography variant='h6'>{Number(inst.avg[k] ?? 0).toFixed(2)}</Typography>
																	</div>
																))
															) : (
																<Typography variant='body2'>No data</Typography>
															)}
														</CardContent>
													</Card>
												</Grid>
											);
										})}
									</Grid>
								</Box>
							)}
						</Grid>
					);
				})}
			</Grid>

			{modalInfo && (
				<SensorTypeModal
					open={!!modalInfo}
					onClose={() => setModalInfo(null)}
					sensorType={modalInfo.type}
					instance={modalInfo.instance}
				/>
			)}
		</Box>
	);
}
