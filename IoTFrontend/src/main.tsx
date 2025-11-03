import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import App from './App';

const base = createTheme();
const theme = deepmerge(
	base,
	createTheme({
		palette: {
			mode: 'light',
			primary: { main: '#1976d2' },
			secondary: { main: '#6c5ce7' },
			background: { default: '#f6f8fb', paper: '#ffffff' },
		},
		shape: { borderRadius: 14 },
		typography: {
			fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
			h4: { fontWeight: 700 },
			subtitle1: { fontWeight: 600 },
		},
		components: {
			MuiPaper: {
				defaultProps: { elevation: 1 },
				styleOverrides: { root: { borderRadius: 16 } },
			},
			MuiCard: {
				defaultProps: { elevation: 1 },
				styleOverrides: { root: { borderRadius: 16 } },
			},
			MuiButton: {
				defaultProps: { variant: 'contained', size: 'small' },
				styleOverrides: { root: { textTransform: 'none', borderRadius: 12 } },
			},
			MuiTextField: { defaultProps: { size: 'small', variant: 'outlined' } },
			MuiMenuItem: { styleOverrides: { root: { fontSize: 14 } } },
		},
	})
);

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</React.StrictMode>
);
