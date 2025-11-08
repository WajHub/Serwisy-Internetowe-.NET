import { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { SensorRecord } from '../types';
import { fetchWallet } from '../services/api';

export default function WalletPanel({ records }: { records: SensorRecord[] }) {
	const [balances, setBalances] = useState<Record<string, number | null>>({});

	const instances = useMemo(() => Array.from(new Set(records.map(r => r.sensorId))).slice(0, 50), [records]);

	useEffect(() => {
		let mounted = true;
		let t: any = null;

		async function load() {
			try {
				if (!instances || instances.length === 0) {
					if (mounted) setBalances({});
					return;
				}

				const res: Array<{ id: string; bal: number | null }> = await Promise.all(
					instances.map(async (id: string) => {
						const bal = await fetchWallet(id);
						return { id, bal };
					})
				);

				if (!mounted) return;

				setBalances(prev => {
					const next: Record<string, number | null> = { ...prev };
					res.forEach(({ id, bal }) => {
						if (bal !== null && bal !== undefined) {
							next[id] = bal;
						} else {
							if (!(id in next)) next[id] = null;
						}
					});
					Object.keys(next).forEach(k => {
						if (!instances.includes(k)) delete next[k];
					});
					return next;
				});
			} catch (e) {
				// ignore
			}
		}

		load();
		t = setInterval(() => load(), 2000);

		return () => {
			mounted = false;
			if (t) clearInterval(t);
		};
	}, [instances.length]);

	const shownInstances = Object.keys(balances).sort();

	if (!shownInstances.length) return <Typography variant='body2'>No wallet data</Typography>;

	return (
		<Grid container spacing={1}>
			{shownInstances.map(id => (
				<Grid item component={'div' as any} xs={12} sm={6} md={4} key={id}>
					<Card variant='outlined'>
						<CardContent>
							<Typography variant='subtitle2'>{id}</Typography>
							<Typography variant='h6'>{balances[id] == null ? '—' : `${balances[id]} SOL`}</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}
