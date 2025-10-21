import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sensor } from '@/types/sensor';
import { Activity, AlertCircle } from 'lucide-react';

interface SensorCardProps {
  sensor: Sensor;
  onClick?: () => void;
}

export function SensorCard({ sensor, onClick }: SensorCardProps) {
  const isActive = sensor.status === 'active';
  const lastValue = sensor.lastValue?.toFixed(2) || 'N/A';
  const averageValue = sensor.averageValue?.toFixed(2) || 'N/A';

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${!isActive ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{sensor.name}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {sensor.sensorType}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {isActive ? (
              <Activity className="h-4 w-4 text-green-500 animate-pulse" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sensor.location && (
            <div className="text-sm">
              <span className="text-muted-foreground">Location: </span>
              <span className="font-medium">{sensor.location}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Last Value</p>
              <p className="text-xl font-bold text-primary">{lastValue}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Average (100)</p>
              <p className="text-xl font-bold text-secondary">{averageValue}</p>
            </div>
          </div>
          {sensor.lastReading && (
            <div className="text-xs text-muted-foreground">
              Updated: {new Date(sensor.lastReading.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

