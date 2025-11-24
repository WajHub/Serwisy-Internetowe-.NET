import { useState } from 'react';
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
	const [tableResetKey, setTableResetKey] = useState(0);
	const [syncKey, setSyncKey] = useState(0);

	return (
		<Box>
			<Paper sx={{ p: 2, mb: 2 }}>
				<FiltersPanel
					onChange={f => {
						const newFilters = (prev => ({ ...prev, ...f }))(filters);
						setFilters(newFilters);
						setTableResetKey(k => k + 1);
						(async () => {
							setLoading(true);
							try {
								const res = await fetchSensors(newFilters);
								setData(res);
								setSyncKey(k => k + 1);
							} finally {
								setLoading(false);
							}
						})();
					}}
				/>
			</Paper>

			<Grid container spacing={2}>
				<Grid item component={'div' as any} xs={12} md={8}>
					<Paper sx={{ p: 2 }}>
						<DataTable
							records={data}
							loading={loading}
							resetKey={tableResetKey}
							onReload={async () => {
								setLoading(true);
								try {
									const res = await fetchSensors(filters);
									setData(res);
									setSyncKey(k => k + 1);
								} finally {
									setLoading(false);
								}
							}}
						/>
					</Paper>
				</Grid>
				<Grid item component={'div' as any} xs={12} md={4}>
					<Paper sx={{ p: 2, mb: 2 }}>
						<ChartsPanel records={data} syncKey={syncKey} />
					</Paper>
					<Paper sx={{ p: 2, mb: 2 }}>
						<DashboardPanel />
					</Paper>
					<Paper sx={{ p: 2, mt: 2 }}>
						<WalletPanel records={data} syncKey={syncKey} />
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
