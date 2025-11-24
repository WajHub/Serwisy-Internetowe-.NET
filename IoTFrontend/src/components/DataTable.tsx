import { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { SensorRecord } from '../types';
import { exportToCsv, exportToJson } from '../utils/export';

export default function DataTable({
	records,
	loading,
	onReload,
	resetKey,
}: {
	records: SensorRecord[];
	loading: boolean;
	onReload: () => void;
	resetKey?: number;
}) {
	const [orderBy, setOrderBy] = useState<'timestamp' | 'sensorId'>('timestamp');
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');
	const [selected, setSelected] = useState<string[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);

	const sorted = useMemo(() => {
		const copy = [...records];
		copy.sort((a, b) => {
			const av = orderBy === 'timestamp' ? new Date(a.timestamp).getTime() : a.sensorId;
			const bv = orderBy === 'timestamp' ? new Date(b.timestamp).getTime() : b.sensorId;
			if (av < (bv as any)) return order === 'asc' ? -1 : 1;
			if (av > (bv as any)) return order === 'asc' ? 1 : -1;
			return 0;
		});
		return copy;
	}, [records, orderBy, order]);

	const paged = useMemo(
		() => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[sorted, page, rowsPerPage]
	);

	useEffect(() => {
		setPage(0);
	}, [resetKey]);

	return (
		<div style={{ width: '100%' }}>
			<Stack direction='row' spacing={2} sx={{ mb: 1 }} alignItems='center'>
				<Button
					variant='outlined'
					onClick={() => exportToCsv(selected.length ? records.filter(r => selected.includes(r.id)) : records)}>
					Export CSV
				</Button>
				<Button
					variant='outlined'
					onClick={() => exportToJson(selected.length ? records.filter(r => selected.includes(r.id)) : records)}>
					Export JSON
				</Button>
				<Button variant='contained' onClick={onReload}>
					Sync
				</Button>
				{loading && <CircularProgress size={20} />}
				<div style={{ marginLeft: 'auto' }}>{selected.length ? `${selected.length} selected` : ''}</div>
			</Stack>

			<TableContainer>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell padding='checkbox'>
								<Checkbox
									indeterminate={selected.length > 0 && selected.length < records.length}
									checked={records.length > 0 && selected.length === records.length}
									onChange={e => {
										if (e.target.checked) setSelected(records.map(r => r.id));
										else setSelected([]);
									}}
								/>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'sensorId'}
									direction={order}
									onClick={() => {
										setOrderBy('sensorId');
										setOrder(order === 'asc' ? 'desc' : 'asc');
									}}>
									Sensor
								</TableSortLabel>
							</TableCell>
							<TableCell>Type</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'timestamp'}
									direction={order}
									onClick={() => {
										setOrderBy('timestamp');
										setOrder(order === 'asc' ? 'desc' : 'asc');
									}}>
									Timestamp
								</TableSortLabel>
							</TableCell>
							<TableCell>Data</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paged.map(r => {
							const isSelected = selected.includes(r.id);
							return (
								<TableRow key={r.id} hover selected={isSelected}>
									<TableCell padding='checkbox'>
										<Checkbox
											checked={isSelected}
											onChange={e => {
												if (e.target.checked) setSelected(prev => [...prev, r.id]);
												else setSelected(prev => prev.filter(x => x !== r.id));
											}}
										/>
									</TableCell>
									<TableCell>{r.sensorId}</TableCell>
									<TableCell>{r.sensorType}</TableCell>
									<TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
									<TableCell>
										<pre style={{ margin: 0 }}>{JSON.stringify(r.data)}</pre>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component='div'
				count={sorted.length}
				page={page}
				onPageChange={(_, p) => setPage(p)}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={e => {
					setRowsPerPage(parseInt(e.target.value, 10));
					setPage(0);
				}}
			/>
		</div>
	);
}
