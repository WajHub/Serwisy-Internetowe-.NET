import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useSensorContext } from '@/contexts/SensorContext';
import { SensorCard } from '@/components/SensorCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, BarChart3, Table2 } from 'lucide-react';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { sensors, loading, error, refreshSensors } = useSensorContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSensors();
    setIsRefreshing(false);
  };

  const handleViewDetails = (sensorId: string) => {
    setLocation(`/details/${sensorId}`);
  };

  const handleViewCharts = () => {
    setLocation('/charts');
  };

  const handleViewTable = () => {
    setLocation('/table');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-500 bg-red-50 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-200">{error}</p>
              <Button onClick={handleRefresh} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">IoT Sensor Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of {sensors.length} sensors across your infrastructure
          </p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleViewTable}
            variant="outline"
            size="sm"
          >
            <Table2 className="h-4 w-4 mr-2" />
            View Table
          </Button>
          <Button
            onClick={handleViewCharts}
            variant="outline"
            size="sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Charts
          </Button>
        </div>

        {loading && sensors.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-6 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Sensors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{sensors.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {sensors.filter(s => s.status === 'active').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Inactive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-yellow-600">
                    {sensors.filter(s => s.status === 'inactive').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    {sensors.filter(s => s.status === 'error').length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {['BatterySensor', 'DriveSystemSensor', 'VehicleDynamicsSensor', 'EnvironmentalSensor'].map(
              (sensorType) => {
                const typeSensors = sensors.filter(s => s.sensorType === sensorType);
                if (typeSensors.length === 0) return null;

                return (
                  <div key={sensorType} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 capitalize">
                      {sensorType.replace(/([A-Z])/g, ' $1').trim()}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {typeSensors.map(sensor => (
                        <SensorCard
                          key={sensor.sensorId}
                          sensor={sensor}
                          onClick={() => handleViewDetails(sensor.sensorId)}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </>
        )}
      </div>
    </div>
  );
}

