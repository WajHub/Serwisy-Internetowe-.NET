import {
  SensorReading,
  Sensor,
  SensorType,
  FilterCriteria,
  PaginatedResponse,
  BatterySensorData,
  DriveSystemSensorData,
  VehicleDynamicsSensorData,
  EnvironmentalSensorData,
} from "@/types/sensor";

let mockReadings: SensorReading[] = [];
let readingId = 0;

const SENSORS: Sensor[] = [
  {
    sensorId: "BatterySensor-1",
    sensorType: "BatterySensor",
    name: "Main Battery Pack",
    location: "Front Compartment",
    status: "active",
  },
  {
    sensorId: "BatterySensor-2",
    sensorType: "BatterySensor",
    name: "Auxiliary Battery",
    location: "Rear Compartment",
    status: "active",
  },
  {
    sensorId: "BatterySensor-3",
    sensorType: "BatterySensor",
    name: "Backup Battery",
    location: "Center Console",
    status: "active",
  },
  {
    sensorId: "BatterySensor-4",
    sensorType: "BatterySensor",
    name: "Emergency Battery",
    location: "Trunk",
    status: "active",
  },
  {
    sensorId: "DriveSystemSensor-1",
    sensorType: "DriveSystemSensor",
    name: "Front Motor",
    location: "Front Axle",
    status: "active",
  },
  {
    sensorId: "DriveSystemSensor-2",
    sensorType: "DriveSystemSensor",
    name: "Rear Motor",
    location: "Rear Axle",
    status: "active",
  },
  {
    sensorId: "DriveSystemSensor-3",
    sensorType: "DriveSystemSensor",
    name: "Left Motor",
    location: "Left Side",
    status: "active",
  },
  {
    sensorId: "DriveSystemSensor-4",
    sensorType: "DriveSystemSensor",
    name: "Right Motor",
    location: "Right Side",
    status: "active",
  },
  {
    sensorId: "VehicleDynamicsSensor-1",
    sensorType: "VehicleDynamicsSensor",
    name: "Main Dynamics Unit",
    location: "Center of Mass",
    status: "active",
  },
  {
    sensorId: "VehicleDynamicsSensor-2",
    sensorType: "VehicleDynamicsSensor",
    name: "Front Dynamics",
    location: "Front Suspension",
    status: "active",
  },
  {
    sensorId: "VehicleDynamicsSensor-3",
    sensorType: "VehicleDynamicsSensor",
    name: "Rear Dynamics",
    location: "Rear Suspension",
    status: "active",
  },
  {
    sensorId: "VehicleDynamicsSensor-4",
    sensorType: "VehicleDynamicsSensor",
    name: "Steering Dynamics",
    location: "Steering Column",
    status: "active",
  },
  {
    sensorId: "EnvironmentalSensor-1",
    sensorType: "EnvironmentalSensor",
    name: "Cabin Environment",
    location: "Dashboard",
    status: "active",
  },
  {
    sensorId: "EnvironmentalSensor-2",
    sensorType: "EnvironmentalSensor",
    name: "Exterior Environment",
    location: "Front Bumper",
    status: "active",
  },
  {
    sensorId: "EnvironmentalSensor-3",
    sensorType: "EnvironmentalSensor",
    name: "Engine Bay Environment",
    location: "Engine Compartment",
    status: "active",
  },
  {
    sensorId: "EnvironmentalSensor-4",
    sensorType: "EnvironmentalSensor",
    name: "Cargo Environment",
    location: "Cargo Area",
    status: "active",
  },
];

function generateSensorData(
  sensorType: SensorType,
  sensorId: string,
  timestamp: Date
): any {
  const hour = timestamp.getHours();
  const dayOfWeek = timestamp.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const sensorSeed = sensorId.split("-").pop() || "1";
  const sensorNumber = parseInt(sensorSeed) || 1;

  switch (sensorType) {
    case "BatterySensor":
      const baseCharge = isWeekend ? 85 : 75;
      const dailyCycle = Math.sin(((hour - 6) * Math.PI) / 12) * 20;
      const chargeLevel = Math.max(
        10,
        Math.min(
          100,
          baseCharge +
            dailyCycle +
            (sensorNumber - 1) * 5 +
            (Math.random() - 0.5) * 10
        )
      );

      return {
        chargeLevel: Math.round(chargeLevel * 10) / 10,
        voltage:
          Math.round(
            (350 + chargeLevel * 0.5 + (Math.random() - 0.5) * 20) * 10
          ) / 10,
        temperature:
          Math.round(
            (25 +
              Math.sin((hour * Math.PI) / 12) * 10 +
              (Math.random() - 0.5) * 5) *
              10
          ) / 10,
        current:
          Math.round(
            (chargeLevel > 80
              ? -5
              : 15 - chargeLevel * 0.2 + (Math.random() - 0.5) * 10) * 10
          ) / 10,
      } as BatterySensorData;

    case "DriveSystemSensor":
      const baseRPM = isWeekend ? 2000 : 3000;
      const rpmVariation = Math.sin((hour * Math.PI) / 12) * 2000;
      const rpm = Math.max(
        500,
        baseRPM +
          rpmVariation +
          (sensorNumber - 1) * 500 +
          (Math.random() - 0.5) * 1000
      );

      const torque = Math.max(50, rpm * 0.1 + (Math.random() - 0.5) * 50);
      const motorTemp = Math.max(
        20,
        30 + rpm / 100 + (Math.random() - 0.5) * 20
      );
      const currentDraw = Math.max(10, rpm / 50 + (Math.random() - 0.5) * 20);

      return {
        rpm: Math.round(rpm),
        torque: Math.round(torque * 10) / 10,
        motorTemperature: Math.round(motorTemp * 10) / 10,
        currentDraw: Math.round(currentDraw * 10) / 10,
      } as DriveSystemSensorData;

    case "VehicleDynamicsSensor":
      const baseSpeed = isWeekend ? 40 : 60;
      const speedVariation = Math.sin((hour * Math.PI) / 12) * 30;
      const speed = Math.max(
        0,
        baseSpeed +
          speedVariation +
          (sensorNumber - 1) * 10 +
          (Math.random() - 0.5) * 20
      );

      const acceleration = Math.max(-5, Math.min(5, (Math.random() - 0.5) * 4));
      const steeringAngle = Math.max(
        -45,
        Math.min(45, (Math.random() - 0.5) * 30)
      );
      const tiltAngle = Math.max(-10, Math.min(10, (Math.random() - 0.5) * 6));

      return {
        speed: Math.round(speed * 10) / 10,
        acceleration: Math.round(acceleration * 10) / 10,
        steeringAngle: Math.round(steeringAngle * 10) / 10,
        tiltAngle: Math.round(tiltAngle * 10) / 10,
      } as VehicleDynamicsSensorData;

    case "EnvironmentalSensor":
      const baseTemp = isWeekend ? 22 : 20;
      const tempCycle = Math.sin(((hour - 6) * Math.PI) / 12) * 8;
      const locationOffset = (sensorNumber - 1) * 2;
      const ambientTemperature =
        baseTemp + tempCycle + locationOffset + (Math.random() - 0.5) * 2;

      const humidity = Math.max(
        20,
        Math.min(
          95,
          60 - (ambientTemperature - 20) * 2 + (Math.random() - 0.5) * 10
        )
      );
      const pressure = 1013 + (Math.random() - 0.5) * 20;
      const lightLevel = Math.max(
        0,
        Math.sin(((hour - 6) * Math.PI) / 12) * 500 +
          (Math.random() - 0.5) * 100
      );

      return {
        ambientTemperature: Math.round(ambientTemperature * 10) / 10,
        humidity: Math.round(humidity * 10) / 10,
        pressure: Math.round(pressure * 10) / 10,
        lightLevel: Math.round(lightLevel * 10) / 10,
      } as EnvironmentalSensorData;

    default:
      return {};
  }
}

export function initializeMockData() {
  mockReadings = [];
  const now = new Date();

  SENSORS.forEach(sensor => {
    for (let i = 0; i < 200; i++) {
      const timestamp = new Date(now.getTime() - (200 - i) * 15 * 60 * 1000);
      mockReadings.push({
        sensorType: sensor.sensorType,
        sensorId: sensor.sensorId,
        timestamp: timestamp.toISOString(),
        data: generateSensorData(sensor.sensorType, sensor.sensorId, timestamp),
      });
    }
  });

  mockReadings.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export async function getSensors(): Promise<Sensor[]> {
  await new Promise(resolve => setTimeout(resolve, 100));

  if (mockReadings.length === 0) {
    initializeMockData();
  }

  const sensorsWithRandomStatus = SENSORS.map(sensor => {
    if (Math.random() < 0.05) {
      const statuses: ('active' | 'inactive' | 'error')[] = ['active', 'inactive', 'error'];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      return { ...sensor, status: newStatus };
    }
    return sensor;
  });

  return sensorsWithRandomStatus.map(sensor => {
    const sensorReadings = mockReadings.filter(
      r => r.sensorId === sensor.sensorId
    );
    const lastReading = sensorReadings[sensorReadings.length - 1];

    let lastValue = 0;
    let averageValue = 0;

    if (lastReading) {
      const data = lastReading.data as any;
      const values = Object.values(data).filter(
        v => typeof v === "number"
      ) as number[];
      lastValue = values[0] || 0;

      const last100 = sensorReadings.slice(-100);
      const allValues = last100.flatMap(r => {
        const d = r.data as any;
        return Object.values(d).filter(v => typeof v === "number") as number[];
      });
      averageValue =
        allValues.length > 0
          ? allValues.reduce((a, b) => a + b, 0) / allValues.length
          : 0;
    }

    return {
      ...sensor,
      lastReading,
      lastValue,
      averageValue,
    };
  });
}

export async function getSensorReadings(
  filters?: FilterCriteria,
  page: number = 1,
  pageSize: number = 50
): Promise<PaginatedResponse<SensorReading>> {
  await new Promise(resolve => setTimeout(resolve, 150));

  if (mockReadings.length === 0) {
    initializeMockData();
  }

  let filtered = [...mockReadings];

  if (filters) {
    if (filters.startDate) {
      filtered = filtered.filter(
        r => new Date(r.timestamp) >= filters.startDate!
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        r => new Date(r.timestamp) <= filters.endDate!
      );
    }
    if (filters.sensorTypes && filters.sensorTypes.length > 0) {
      filtered = filtered.filter(r =>
        filters.sensorTypes!.includes(r.sensorType)
      );
    }
    if (filters.sensorIds && filters.sensorIds.length > 0) {
      filtered = filtered.filter(r => filters.sensorIds!.includes(r.sensorId));
    }
  }

  filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return {
    data,
    total,
    page,
    pageSize,
  };
}

export async function getSensorReadingsBySensorId(
  sensorId: string,
  filters?: FilterCriteria
): Promise<SensorReading[]> {
  await new Promise(resolve => setTimeout(resolve, 100));

  if (mockReadings.length === 0) {
    initializeMockData();
  }

  let filtered = mockReadings.filter(r => r.sensorId === sensorId);

  if (filters) {
    if (filters.startDate) {
      filtered = filtered.filter(
        r => new Date(r.timestamp) >= filters.startDate!
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        r => new Date(r.timestamp) <= filters.endDate!
      );
    }
  }

  return filtered;
}

export function addSensorReading(sensorId: string): SensorReading {
  const sensor = SENSORS.find(s => s.sensorId === sensorId);
  if (!sensor) throw new Error(`Sensor ${sensorId} not found`);

  const now = new Date();
  const reading: SensorReading = {
    sensorType: sensor.sensorType,
    sensorId,
    timestamp: now.toISOString(),
    data: generateSensorData(sensor.sensorType, sensorId, now),
  };

  mockReadings.push(reading);

  if (mockReadings.length > 1000) {
    mockReadings = mockReadings.slice(-1000);
  }

  return reading;
}

export function exportAsCSV(readings: SensorReading[]): string {
  if (readings.length === 0) return "";

  const headers = [
    "Sensor Type",
    "Sensor ID",
    "Timestamp",
    ...Object.keys(readings[0].data),
  ];
  const rows = readings.map(r => [
    r.sensorType,
    r.sensorId,
    r.timestamp,
    ...Object.values(r.data),
  ]);

  const csv = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
}

export function exportAsJSON(readings: SensorReading[]): string {
  return JSON.stringify(readings, null, 2);
}

export function getSensorTypes(): SensorType[] {
  return Array.from(new Set(SENSORS.map(s => s.sensorType)));
}

export function getSensorsByType(sensorType: SensorType): Sensor[] {
  return SENSORS.filter(s => s.sensorType === sensorType);
}
