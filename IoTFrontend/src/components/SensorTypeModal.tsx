import { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { fetchLastRecords } from '../services/api';
import { SensorRecord } from '../types';

export default function SensorTypeModal({
	open,
	onClose,
	sensorType,
	instance,
}: {
	open: boolean;
	onClose: () => void;
	sensorType: string;
	instance?: string;
}) {
	const [records, setRecords] = useState<SensorRecord[]>([]);
	const [instanceAggs, setInstanceAggs] = useState<
		Record<string, Record<string, { min: number; max: number; avg: number }>>
	>({});

	useEffect(() => {
		let mounted = true;
		let t: any = null;
		async function load() {
			try {
				const r = await fetchLastRecords(sensorType, instance ?? 'all', 100);
				if (mounted) setRecords(r.slice(0, 100));

				if (!instance) {
					const instances = Array.from(new Set(r.map(x => x.sensorId))).slice(0, 50);
					const promises = instances.map(async inst => {
						const recs = await fetchLastRecords(sensorType, inst, 100);

						const allKeys = Array.from(new Set(recs.flatMap(rr => Object.keys(rr.data))));
						const out: Record<string, { min: number; max: number; avg: number }> = {};
						allKeys.forEach(k => {
							const vals = recs.map(rr => {
								const v = Number((rr.data as any)[k]);
								return isNaN(v) ? 0 : v;
							});
							if (vals.length === 0) return;
							out[k] = {
								min: Math.min(...vals),
								max: Math.max(...vals),
								avg: vals.reduce((s, v) => s + v, 0) / vals.length,
							};
						});
						return { id: inst, agg: out };
					});
					const resolved = await Promise.all(promises);
					const map: Record<string, Record<string, { min: number; max: number; avg: number }>> = {};
					resolved.forEach(rp => {
						if (rp) map[rp.id] = rp.agg;
					});
					if (mounted) setInstanceAggs(map);
				}
			} catch (e) {
				// ignore
			}
		}

		if (open) {
			load();
			t = setInterval(() => load(), 1000);
		}

		return () => {
			mounted = false;
			if (t) clearInterval(t);
		};
	}, [open, sensorType, instance]);

	const agg = useMemo(() => {
		if (!records || records.length === 0) return null;
		const allKeys = Array.from(new Set(records.flatMap(r => Object.keys(r.data))));
		if (allKeys.length === 0) return null;
		const result: Record<string, { min: number; max: number; avg: number }> = {};
		allKeys.forEach(k => {
			const vals = records.map(r => {
				const v = Number(r.data[k]);
				return isNaN(v) ? 0 : v;
			});
			if (vals.length === 0) return;
			const min = Math.min(...vals);
			const max = Math.max(...vals);
			const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
			result[k] = { min, max, avg };
		});
		return result;
	}, [records]);

	return (
		// Use full width and a larger maxWidth so the modal content spans the available space like Filters
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='xl'>
			<DialogTitle>{sensorType} (last 100) — live</DialogTitle>
			<DialogContent dividers sx={{ width: '100%' }}>
				{!agg && <Typography>No numeric data</Typography>}
				{agg && (
					<List>
						{Object.entries(agg).map(([k, v]) => (
							<ListItem key={k}>
								<div style={{ width: '100%' }}>
									<Typography variant='subtitle2'>{k}</Typography>
									<Typography variant='body2'>avg: {v.avg.toFixed(2)}</Typography>
								</div>
							</ListItem>
						))}
					</List>
				)}
				{!instance && Object.keys(instanceAggs).length > 0 && (
					<>
						<Typography variant='subtitle1' sx={{ mt: 2, mb: 1 }}>
							Per-instance averages
						</Typography>
						<Grid container spacing={1}>
							{Object.entries(instanceAggs).map(([id, aggMap]) => (
								<Grid item component={'div' as any} xs={12} sm={6} key={id}>
									<Card variant='outlined'>
										<CardContent>
											<Typography variant='subtitle2'>{id}</Typography>
											{Object.entries(aggMap).map(([k, v]) => (
												<div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
													<Typography variant='body2'>{k}</Typography>
													<Typography variant='body2'>{v.avg.toFixed(2)}</Typography>
												</div>
											))}
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
