import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Sensor, SensorReading } from '@/types/sensor';
import { getSensors, addSensorReading, initializeMockData } from '@/services/sensorApi';

interface SensorContextType {
  sensors: Sensor[];
  latestReadings: Map<string, SensorReading>;
  loading: boolean;
  error: string | null;
  refreshSensors: () => Promise<void>;
  simulateNewReading: (sensorId: string) => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export function SensorProvider({ children }: { children: React.ReactNode }) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [latestReadings, setLatestReadings] = useState<Map<string, SensorReading>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSensors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      initializeMockData();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const data = await getSensors();
      
      if (data && data.length > 0) {
        setSensors(data);
        
        const readings = new Map<string, SensorReading>();
        data.forEach(sensor => {
          if (sensor.lastReading) {
            readings.set(sensor.sensorId, sensor.lastReading);
          }
        });
        setLatestReadings(readings);
      } else {
        setTimeout(() => refreshSensors(), 100);
      }
    } catch (err) {
      console.error('Failed to fetch sensors:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sensors');
      
      setTimeout(() => refreshSensors(), 1000);
    } finally {
      setLoading(false);
    }
  }, []);

  const simulateNewReading = useCallback((sensorId: string) => {
    try {
      const newReading = addSensorReading(sensorId);
      setLatestReadings(prev => new Map(prev).set(sensorId, newReading));
      
      setSensors(prev => prev.map(s => {
        if (s.sensorId === sensorId) {
          const data = newReading.data as any;
          const values = Object.values(data).filter(v => typeof v === 'number') as number[];
          return {
            ...s,
            lastReading: newReading,
            lastValue: values[0] || 0,
          };
        }
        return s;
      }));
    } catch (err) {
      console.error('Failed to simulate reading:', err);
    }
  }, []);

  useEffect(() => {
    refreshSensors();
  }, [refreshSensors]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomSensorIndex = Math.floor(Math.random() * sensors.length);
      if (sensors[randomSensorIndex]) {
        simulateNewReading(sensors[randomSensorIndex].sensorId);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sensors, simulateNewReading]);

  return (
    <SensorContext.Provider value={{ sensors, latestReadings, loading, error, refreshSensors, simulateNewReading }}>
      {children}
    </SensorContext.Provider>
  );
}

export function useSensorContext() {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensorContext must be used within SensorProvider');
  }
  return context;
}

