import { useMemo, useState, useEffect } from 'react';
import { SensorRecord } from '../types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Agg = 'avg' | 'min' | 'max';

function aggregateValues(values: number[], agg: Agg) {
	if (values.length === 0) return NaN;
	if (agg === 'avg') return values.reduce((s, v) => s + v, 0) / values.length;
	if (agg === 'min') return Math.min(...values);
	return Math.max(...values);
}

export default function ChartsPanel({ records }: { records: SensorRecord[] }) {
	const [sensorType, setSensorType] = useState<string>('');
	const [instance, setInstance] = useState<string>('');
	const [valueKey, setValueKey] = useState<string | null>(null);
	const [agg, setAgg] = useState<Agg>('avg');

	const sensorTypes = useMemo(() => Array.from(new Set(records.map(r => r.sensorType))), [records]);

	const instances = useMemo(() => {
		if (!sensorType) return [] as string[];
		const filtered = records.filter(r => r.sensorType === sensorType);
		return Array.from(new Set(filtered.map(r => r.sensorId)));
	}, [records, sensorType]);

	const valueKeys = useMemo(() => {
		let filtered: SensorRecord[];
		if (!sensorType) return [] as string[];
		if (instance === 'all') filtered = records.filter(r => r.sensorType === sensorType);
		else filtered = records.filter(r => r.sensorType === sensorType && r.sensorId === instance);

		const allKeys = Array.from(new Set(filtered.flatMap(r => Object.keys(r.data))));
		return allKeys;
	}, [records, sensorType, instance]);

	useEffect(() => {
		if (!sensorType && sensorTypes.length) setSensorType(sensorTypes[0]);
	}, [sensorTypes, sensorType]);

	useEffect(() => {
		if (instances.length && instance === '') setInstance(instances[0]);
	}, [instances, instance]);

	useEffect(() => {
		if (!valueKey && valueKeys.length) setValueKey(valueKeys[0]);
	}, [valueKeys, valueKey]);

	const points = useMemo(() => {
		if (!valueKey) return [] as { ts: number; time: string; value: number }[];

		let filtered: SensorRecord[];
		if (!sensorType) return [] as { ts: number; time: string; value: number }[];
		if (instance === 'all') filtered = records.filter(r => r.sensorType === sensorType);
		else filtered = records.filter(r => r.sensorType === sensorType && r.sensorId === instance);

		const series = filtered
			.map(r => ({ t: new Date(r.timestamp), v: Number((r.data as any)[valueKey]) }))
			.map(x => ({ t: x.t, v: isNaN(x.v) ? 0 : x.v }))
			.sort((a, b) => a.t.getTime() - b.t.getTime());

		const buckets: Record<string, number[]> = {};
		series.forEach(p => {
			const key = new Date(
				p.t.getFullYear(),
				p.t.getMonth(),
				p.t.getDate(),
				p.t.getHours(),
				p.t.getMinutes()
			).toISOString();
			buckets[key] = buckets[key] || [];
			buckets[key].push(p.v);
		});

		const arr = Object.entries(buckets)
			.map(([k, vals]) => ({
				ts: new Date(k).getTime(),
				time: new Date(k).toLocaleString(),
				value: aggregateValues(vals, agg),
			}))
			.sort((a, b) => a.ts - b.ts);

		return arr;
	}, [records, sensorType, instance, valueKey, agg]);

	if (!records || records.length === 0) return <Typography>No data</Typography>;

	return (
		<Box>
			<Typography variant='subtitle1' sx={{ mb: 1, fontWeight: 600 }}>
				Charts
			</Typography>

			<Stack direction='row' spacing={2} sx={{ mb: 1 }} alignItems='center'>
				<TextField
					select
					label='Sensor Type'
					value={sensorType}
					onChange={e => setSensorType(e.target.value)}
					sx={{ minWidth: 200 }}>
					{sensorTypes.map(t => (
						<MenuItem key={t} value={t}>
							{t}
						</MenuItem>
					))}
				</TextField>

				<TextField
					select
					label='Instance'
					value={instance}
					onChange={e => setInstance(e.target.value)}
					sx={{ minWidth: 200 }}>
					<MenuItem value={'all'}>All</MenuItem>
					{instances.map(i => (
						<MenuItem key={i} value={i}>
							{i}
						</MenuItem>
					))}
				</TextField>

				<TextField
					select
					label='Value'
					value={valueKey ?? ''}
					onChange={e => setValueKey(e.target.value)}
					sx={{ minWidth: 200 }}>
					{valueKeys.map(k => (
						<MenuItem key={k} value={k}>
							{k}
						</MenuItem>
					))}
				</TextField>

				<TextField
					select
					label='Aggregation'
					value={agg}
					onChange={e => setAgg(e.target.value as Agg)}
					sx={{ minWidth: 140 }}>
					<MenuItem value={'avg'}>Avg</MenuItem>
					<MenuItem value={'min'}>Min</MenuItem>
					<MenuItem value={'max'}>Max</MenuItem>
				</TextField>
			</Stack>

			<div style={{ width: '100%', height: 320 }}>
				<ResponsiveContainer>
					<LineChart data={points} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
						<XAxis
							type='number'
							dataKey='ts'
							domain={['dataMin', 'dataMax']}
							tick={{ fontSize: 11 }}
							minTickGap={24}
							tickFormatter={v => new Date(v as number).toLocaleTimeString()}
						/>
						<YAxis tick={{ fontSize: 11 }} />
						<Tooltip labelFormatter={v => new Date(v as number).toLocaleString()} />
						<Line
							type='monotone'
							dataKey='value'
							stroke='#1976d2'
							dot={false}
							strokeWidth={2}
							isAnimationActive={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</Box>
	);
}
