import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { getSensorReadingsBySensorId, getSensorTypes, getSensorsByType } from '@/services/sensorApi';
import { SensorReading, SensorType } from '@/types/sensor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Filter } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useUrlParams } from '@/hooks/useUrlParams';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

interface ChartData {
  timestamp: string;
  [key: string]: any;
}

export default function Charts() {
  const [, setLocation] = useLocation();
  const { getParam, getArrayParam, setMultipleParams } = useUrlParams();
  const [selectedSensorType, setSelectedSensorType] = useState<SensorType>(() => 
    (getParam('sensorType', 'BatterySensor') as SensorType)
  );
  const [selectedSensorIds, setSelectedSensorIds] = useState<string[]>(() => 
    getArrayParam('sensorIds')
  );
  const [startDate, setStartDate] = useState<string>(() => 
    getParam('startDate', format(subDays(new Date(), 1), 'yyyy-MM-dd'))
  );
  const [endDate, setEndDate] = useState<string>(() => 
    getParam('endDate', format(new Date(), 'yyyy-MM-dd'))
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  const sensorTypes = useMemo(() => getSensorTypes(), []);
  const sensorsOfType = useMemo(() => getSensorsByType(selectedSensorType), [selectedSensorType]);

  useEffect(() => {
    if (sensorsOfType.length > 0 && selectedSensorIds.length === 0) {
      setSelectedSensorIds([sensorsOfType[0].sensorId]);
    }
  }, [selectedSensorType, sensorsOfType, selectedSensorIds.length]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        const allReadings: SensorReading[] = [];
        
        const sensorsToUse = selectedSensorIds.length > 0 ? selectedSensorIds : [sensorsOfType[0]?.sensorId].filter(Boolean);
        
        for (const sensorId of sensorsToUse) {
          if (sensorId) {
            const readings = await getSensorReadingsBySensorId(sensorId, {
              startDate: startDateObj,
              endDate: endDateObj,
            });
            allReadings.push(...readings);
          }
        }

        allReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const dataMap = new Map<string, ChartData>();
        allReadings.forEach(reading => {
          const readingTime = new Date(reading.timestamp);
          const intervalMinutes = Math.floor(readingTime.getMinutes() / 30) * 30;
          const intervalTime = new Date(readingTime);
          intervalTime.setMinutes(intervalMinutes, 0, 0);
          const timestamp = format(intervalTime, 'MM/dd HH:mm');
          
          if (!dataMap.has(timestamp)) {
            dataMap.set(timestamp, { timestamp });
          }
          const data = dataMap.get(timestamp)!;
          const values = reading.data as any;
          Object.entries(values).forEach(([key, value]) => {
            const fieldName = `${reading.sensorId}-${key}`;
            if (data[fieldName] !== undefined) {
              data[fieldName] = (data[fieldName] + value) / 2;
            } else {
              data[fieldName] = value;
            }
          });
        });

        const chartDataArray = Array.from(dataMap.values());
        setChartData(chartDataArray);
      } catch (err) {
        console.error('Failed to load chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sensorsOfType.length > 0) {
      loadChartData();
    }
  }, [selectedSensorIds, startDate, endDate, sensorsOfType]);

  const handleToggleSensorId = (id: string) => {
    const newIds = selectedSensorIds.includes(id) 
      ? selectedSensorIds.filter(s => s !== id) 
      : [...selectedSensorIds, id];
    setSelectedSensorIds(newIds);
    setMultipleParams({ sensorIds: newIds });
  };

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const getChartFields = () => {
    if (chartData.length === 0) return [];
    const firstRow = chartData[0];
    return Object.keys(firstRow).filter(key => key !== 'timestamp');
  };

  const chartFields = getChartFields();

  const formatFieldName = (fieldName: string) => {
    const [sensorId, dataKey] = fieldName.split('-');
    const sensorNumber = sensorId.split('-').pop() || '1';
    const formattedKey = dataKey.replace(/([A-Z])/g, ' $1').trim();
    return `Sensor ${sensorNumber} - ${formattedKey}`;
  };

  const formatTooltipValue = (value: number, name: string) => {
    const [sensorId, dataKey] = name.split('-');
    const unit = dataKey === 'chargeLevel' || dataKey === 'humidity' ? '%' :
                 dataKey === 'voltage' ? 'mV' :
                 dataKey === 'current' ? 'mA' :
                 dataKey === 'temperature' || dataKey === 'motorTemperature' || dataKey === 'ambientTemperature' ? '°C' :
                 dataKey === 'rpm' ? 'rpm' :
                 dataKey === 'torque' ? 'Nm' :
                 dataKey === 'currentDraw' ? 'A' :
                 dataKey === 'speed' ? 'km/h' :
                 dataKey === 'acceleration' ? 'm/s²' :
                 dataKey === 'steeringAngle' || dataKey === 'tiltAngle' ? '°' :
                 dataKey === 'pressure' ? 'hPa' :
                 dataKey === 'lightLevel' ? 'lux' : '';
    return [`${value.toFixed(2)}${unit}`, formatFieldName(name)];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Sensor Data Charts</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Chart Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sensor Type</label>
              <div className="flex flex-wrap gap-2">
                {sensorTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedSensorType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedSensorType(type);
                      setSelectedSensorIds([]);
                      setMultipleParams({ sensorType: type, sensorIds: [] });
                    }}
                  >
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sensor Instances</label>
              <div className="flex flex-wrap gap-2">
                {sensorsOfType.map(sensor => (
                  <Button
                    key={sensor.sensorId}
                    variant={selectedSensorIds.includes(sensor.sensorId) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleSensorId(sensor.sensorId)}
                  >
                    {sensor.sensorId}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setMultipleParams({ startDate: e.target.value });
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setMultipleParams({ endDate: e.target.value });
                  }}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="h-96 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ) : chartData.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No data available for the selected filters
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Time Series (Line Chart)</CardTitle>
                <CardDescription>
                  Sensor values over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 12 }}
                      interval={Math.max(0, Math.floor(chartData.length / 10))}
                    />
                    <YAxis />
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend formatter={formatFieldName} />
                    {chartFields.map((field, idx) => (
                      <Line
                        key={field}
                        type="monotone"
                        dataKey={field}
                        stroke={colors[idx % colors.length]}
                        dot={false}
                        isAnimationActive={false}
                        name={field}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Area Chart</CardTitle>
                <CardDescription>
                  Cumulative sensor values over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 12 }}
                      interval={Math.max(0, Math.floor(chartData.length / 10))}
                    />
                    <YAxis />
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend formatter={formatFieldName} />
                    {chartFields.map((field, idx) => (
                      <Area
                        key={field}
                        type="monotone"
                        dataKey={field}
                        fill={colors[idx % colors.length]}
                        stroke={colors[idx % colors.length]}
                        fillOpacity={0.6}
                        isAnimationActive={false}
                        name={field}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
                <CardDescription>
                  Sensor values comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend formatter={formatFieldName} />
                    {chartFields.map((field, idx) => (
                      <Bar
                        key={field}
                        dataKey={field}
                        fill={colors[idx % colors.length]}
                        isAnimationActive={false}
                        name={field}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {chartFields.map(field => {
                    const values = chartData
                      .map(d => d[field])
                      .filter(v => typeof v === 'number') as number[];
                    
                    if (values.length === 0) return null;

                    const min = Math.min(...values);
                    const max = Math.max(...values);
                    const avg = values.reduce((a, b) => a + b, 0) / values.length;

                    const [sensorId, dataKey] = field.split('-');
                    const unit = dataKey === 'chargeLevel' || dataKey === 'humidity' ? '%' :
                                 dataKey === 'voltage' ? 'mV' :
                                 dataKey === 'current' ? 'mA' :
                                 dataKey === 'temperature' || dataKey === 'motorTemperature' || dataKey === 'ambientTemperature' ? '°C' :
                                 dataKey === 'rpm' ? 'rpm' :
                                 dataKey === 'torque' ? 'Nm' :
                                 dataKey === 'currentDraw' ? 'A' :
                                 dataKey === 'speed' ? 'km/h' :
                                 dataKey === 'acceleration' ? 'm/s²' :
                                 dataKey === 'steeringAngle' || dataKey === 'tiltAngle' ? '°' :
                                 dataKey === 'pressure' ? 'hPa' :
                                 dataKey === 'lightLevel' ? 'lux' : '';

                    return (
                      <Card key={field}>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground mb-2 truncate">{formatFieldName(field)}</p>
                          <div className="space-y-1 text-sm">
                            <div>Min: <span className="font-bold">{min.toFixed(2)}{unit}</span></div>
                            <div>Max: <span className="font-bold">{max.toFixed(2)}{unit}</span></div>
                            <div>Avg: <span className="font-bold">{avg.toFixed(2)}{unit}</span></div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

