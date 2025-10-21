# IoT Sensor Monitoring Frontend

A comprehensive React TypeScript frontend application for monitoring IoT sensors with real-time dashboards, data visualization, filtering, sorting, and export capabilities.

## Features

### Dashboard
- **Real-time Sensor Monitoring**: Display the last value and average value (for the last 100 messages) for each sensor
- **Auto-refresh**: Values automatically update every 3 seconds without requiring a page refresh
- **Sensor Status**: Visual indicators for active, inactive, and error states
- **Sensor Grouping**: Sensors organized by type for easy navigation
- **Summary Statistics**: Overview of total sensors, active, inactive, and error counts

### Data Table
- **Tabular View**: Browse all sensor readings in a structured table format
- **Advanced Filtering**:
  - Filter by date range (start and end date)
  - Filter by sensor type (BatterySensor, TemperatureHumiditySensor, GasConcentrationSensor, SpeedUVIntensitySensor)
  - Filter by sensor instance (individual sensor IDs)
- **Sorting**: Sort data by sensor ID or timestamp in ascending/descending order
- **Pagination**: Navigate through large datasets with configurable page size
- **Data Export**:
  - Export filtered data as CSV
  - Export filtered data as JSON

### Charts & Visualization
- **Multiple Chart Types**:
  - Line Chart: Time series visualization of sensor values
  - Area Chart: Cumulative view of sensor data
  - Bar Chart: Comparative view of sensor values
- **Dynamic Configuration**:
  - Select sensor type
  - Select specific sensor instances
  - Choose date range
- **Statistics**: Min, max, and average values for each metric

## Supported Sensor Types

The application supports four types of sensors, each with 4 instances (16 total):

### 1. Battery Sensor
- **Metrics**: Charge Level (%), Voltage (mV), Temperature (°C), Current (mA)
- **Use Case**: Battery monitoring in devices

### 2. Temperature & Humidity Sensor
- **Metrics**: Temperature (°C), Humidity (%), Dew Point (°C), Heat Index (°C)
- **Use Case**: Environmental monitoring in greenhouses, storage rooms, data centers

### 3. Gas Concentration Sensor
- **Metrics**: CO₂ (ppm), CO (ppm), NO₂ (ppb), O₃ (ppb)
- **Use Case**: Air quality monitoring in factories, parking garages, offices

### 4. Speed & UV Intensity Sensor
- **Metrics**: Speed (km/h), UV Index (0-11+), UV Intensity (W/m²), Direction (0-360°)
- **Use Case**: Weather monitoring and outdoor environmental tracking

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Routing**: Wouter (lightweight routing library)
- **Charting**: Recharts (composable charting library)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Date Handling**: date-fns
- **Data Export**: PapaParse (CSV) + native JSON
- **Icons**: Lucide React

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── SensorCard.tsx          # Reusable sensor card component
│   ├── contexts/
│   │   └── SensorContext.tsx       # Global sensor data context with real-time updates
│   ├── pages/
│   │   ├── Dashboard.tsx           # Main dashboard page
│   │   ├── DataTable.tsx           # Data table with filters and export
│   │   ├── Charts.tsx              # Charts and visualization page
│   │   └── NotFound.tsx            # 404 page
│   ├── services/
│   │   └── sensorApi.ts            # Mock API service with sensor data
│   ├── types/
│   │   └── sensor.ts               # TypeScript interfaces and types
│   ├── App.tsx                     # Main app component with routing
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
└── package.json                    # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm

### Install Dependencies
```bash
cd iot-sensor-frontend
pnpm install
```

### Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## Mock Data

The application uses a mock API service (`sensorApi.ts`) that simulates sensor data:

- **16 Sensors**: 4 instances of each sensor type
- **Historical Data**: 100 readings per sensor over the last 24 hours
- **Real-time Simulation**: New readings are generated every 3 seconds for random sensors
- **Data Persistence**: Data is stored in memory during the session

### Customizing Mock Data

To modify the mock data generation, edit `/client/src/services/sensorApi.ts`:

1. **Change sensor definitions**: Modify the `SENSORS` array
2. **Adjust data generation**: Update the `generateSensorData()` function
3. **Modify update interval**: Change the interval in `SensorContext.tsx` (currently 3 seconds)

## API Integration

To connect to a real backend API:

1. Update the `sensorApi.ts` service to make HTTP requests using `axios` or `fetch`
2. Replace mock data generation with actual API calls
3. Update the `SensorContext.tsx` to handle real-time updates (WebSocket, Server-Sent Events, or polling)

Example API endpoints expected:
- `GET /api/sensors` - Get all sensors
- `GET /api/readings` - Get sensor readings with filters
- `GET /api/readings/:sensorId` - Get readings for a specific sensor
- `POST /api/readings/export/csv` - Export as CSV
- `POST /api/readings/export/json` - Export as JSON

## Features & Compliance

✅ **Implemented Features**:
- Dashboard with real-time updates (auto-refresh without page reload)
- Tabular data view with filtering and sorting
- Data export in CSV and JSON formats
- Multiple chart types for visualization
- Responsive design for mobile and desktop
- TypeScript for type safety
- Modular component architecture

✅ **Requirements Met**:
- Written in React with TypeScript
- Supports 4 different sensor types with 16 instances
- Real-time data display with automatic updates
- Filtering by date, sensor type, and sensor instance
- Sorting capabilities
- Data export functionality
- Chart visualization
- Responsive UI

## Future Enhancements

- WebSocket integration for true real-time updates
- Advanced filtering with saved filter presets
- Custom chart builder
- Alert/notification system for sensor anomalies
- Sensor comparison tools
- Data analytics and trend analysis
- Dark mode toggle
- Internationalization (i18n)
- Performance optimizations for large datasets

## License

MIT X11

## Support

For issues, questions, or contributions, please refer to the project repository.

