import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Filters } from '../services/api';

const sensorTypes = [
	{ value: 'all', label: 'All' },
	{ value: 'environmental', label: 'Environmental' },
	{ value: 'battery', label: 'Battery' },
	{ value: 'drive-system', label: 'Drive System' },
	{ value: 'vehicle-dynamic', label: 'Vehicle Dynamic' },
];

export default function FiltersPanel({ onChange }: { onChange: (f: Filters) => void }) {
	const [from, setFrom] = useState<Date | null>(null);
	const [to, setTo] = useState<Date | null>(null);
	const [sensorType, setSensorType] = useState('all');
	const [instance, setInstance] = useState('all');

	return (
		<Box>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<Stack direction='row' spacing={2} alignItems='center' sx={{ flexWrap: 'wrap', rowGap: 1 }}>
					<DateTimePicker
						label='From'
						value={from}
						onChange={v => setFrom(v)}
						slotProps={{ textField: { sx: { minWidth: 200 } } }}
					/>
					<DateTimePicker
						label='To'
						value={to}
						onChange={v => setTo(v)}
						slotProps={{ textField: { sx: { minWidth: 200 } } }}
					/>
					<TextField
						select
						label='Sensor Type'
						value={sensorType}
						onChange={e => setSensorType(e.target.value)}
						sx={{ minWidth: 200 }}>
						{sensorTypes.map(s => (
							<MenuItem key={s.value} value={s.value}>
								{s.label}
							</MenuItem>
						))}
					</TextField>

					<TextField
						label='Instance'
						value={instance}
						onChange={e => setInstance(e.target.value)}
						sx={{ minWidth: 160 }}
					/>

					<Button
						variant='contained'
						onClick={() => onChange({ fromDate: from ?? undefined, toDate: to ?? undefined, sensorType, instance })}>
						Apply filters
					</Button>
				</Stack>
			</LocalizationProvider>
		</Box>
	);
}
