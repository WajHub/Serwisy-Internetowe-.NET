export type SensorType = 'BatterySensor' | 'DriveSystemSensor' | 'VehicleDynamicsSensor' | 'EnvironmentalSensor';

export interface BatterySensorData {
  chargeLevel: number;
  voltage: number;
  temperature: number;
  current: number;
}

export interface DriveSystemSensorData {
  rpm: number;
  torque: number;
  motorTemperature: number;
  currentDraw: number;
}

export interface VehicleDynamicsSensorData {
  speed: number;
  acceleration: number;
  steeringAngle: number;
  tiltAngle: number;
}

export interface EnvironmentalSensorData {
  ambientTemperature: number;
  humidity: number;
  pressure: number;
  lightLevel: number;
}

export type SensorData = 
  | BatterySensorData 
  | DriveSystemSensorData 
  | VehicleDynamicsSensorData 
  | EnvironmentalSensorData;

export interface SensorReading<T extends SensorData = SensorData> {
  sensorType: SensorType;
  sensorId: string;
  timestamp: string;
  data: T;
}

export interface Sensor {
  sensorId: string;
  sensorType: SensorType;
  name: string;
  location?: string;
  unit?: string;
  lastReading?: SensorReading;
  lastValue?: number;
  averageValue?: number;
  status: 'active' | 'inactive' | 'error';
}

export interface FilterCriteria {
  startDate?: Date;
  endDate?: Date;
  sensorTypes?: SensorType[];
  sensorIds?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

