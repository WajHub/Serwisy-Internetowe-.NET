import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SensorsPage from './pages/SensorsPage';

export default function App() {
	return (
		<>
			<AppBar
				position='sticky'
				color='transparent'
				elevation={0}
				sx={{
					background: 'linear-gradient(90deg, rgba(25,118,210,0.12) 0%, rgba(108,92,231,0.12) 100%)',
					backdropFilter: 'blur(6px)',
					borderBottom: '1px solid rgba(0,0,0,0.06)',
				}}>
				<Toolbar>
					<Typography variant='h6' sx={{ fontWeight: 700 }}>
						IoT Sensors Dashboard
					</Typography>
				</Toolbar>
			</AppBar>
			<Box sx={{ py: 3 }}>
				<Container maxWidth='xl'>
					<Typography variant='h4' sx={{ mb: 3 }}>
						Overview
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} component={'div' as any}>
							<SensorsPage />
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	);
}
