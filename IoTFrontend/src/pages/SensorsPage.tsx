import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FiltersPanel from '../components/FiltersPanel';
import DataTable from '../components/DataTable';
import DashboardPanel from '../components/DashboardPanel';
import ChartsPanel from '../components/ChartsPanel';
import WalletPanel from '../components/WalletPanel';
import { fetchSensors } from '../services/api';
import { SensorRecord } from '../types';

export default function SensorsPage() {
	const [data, setData] = useState<SensorRecord[]>([]);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({
		fromDate: undefined as Date | undefined,
		toDate: undefined as Date | undefined,
		sensorType: 'all',
		instance: 'all',
	});

	useEffect(() => {
		let mounted = true;
		let timer: any = null;

		async function load() {
			setLoading(true);
			try {
				const res = await fetchSensors(filters);
				if (mounted) setData(res);
			} finally {
				if (mounted) setLoading(false);
			}
		}

		load();

		timer = setInterval(() => load(), 1000);

		return () => {
			mounted = false;
			if (timer) clearInterval(timer);
		};
	}, [filters]);

	return (
		<Box>
			<Paper sx={{ p: 2, mb: 2 }}>
				<FiltersPanel onChange={f => setFilters(prev => ({ ...prev, ...f }))} />
			</Paper>

			<Grid container spacing={2}>
				<Grid item component={'div' as any} xs={12} md={8}>
					<Paper sx={{ p: 2 }}>
						<DataTable
							records={data}
							loading={loading}
							onReload={() => {
								fetchSensors(filters).then(setData);
							}}
						/>
					</Paper>
				</Grid>
				<Grid item component={'div' as any} xs={12} md={4}>
					<Paper sx={{ p: 2, mb: 2 }}>
						<DashboardPanel records={data} />
					</Paper>
					<Paper sx={{ p: 2 }}>
						<ChartsPanel records={data} />
					</Paper>
					<Paper sx={{ p: 2, mt: 2 }}>
						<WalletPanel records={data} />
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
