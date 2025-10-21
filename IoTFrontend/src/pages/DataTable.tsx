import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { getSensorReadings, getSensorTypes, getSensorsByType, exportAsCSV, exportAsJSON } from '@/services/sensorApi';
import { SensorReading, SensorType, FilterCriteria } from '@/types/sensor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Filter, X } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useUrlParams } from '@/hooks/useUrlParams';

export default function DataTable() {
  const [, setLocation] = useLocation();
  const { getParam, getArrayParam, setMultipleParams, clearParams } = useUrlParams();
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);

  const [startDate, setStartDate] = useState<string>(() => 
    getParam('startDate', format(subDays(new Date(), 1), 'yyyy-MM-dd'))
  );
  const [endDate, setEndDate] = useState<string>(() => 
    getParam('endDate', format(new Date(), 'yyyy-MM-dd'))
  );
  const [selectedSensorTypes, setSelectedSensorTypes] = useState<SensorType[]>(() => 
    getArrayParam('sensorTypes') as SensorType[]
  );
  const [selectedSensorIds, setSelectedSensorIds] = useState<string[]>(() => 
    getArrayParam('sensorIds')
  );
  const [sortBy, setSortBy] = useState<'timestamp' | 'sensorId'>(() => 
    (getParam('sortBy', 'timestamp') as 'timestamp' | 'sensorId')
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => 
    (getParam('sortOrder', 'desc') as 'asc' | 'desc')
  );

  const sensorTypes = useMemo(() => getSensorTypes(), []);
  const allSensorIds = useMemo(() => {
    const ids = new Set<string>();
    sensorTypes.forEach(type => {
      getSensorsByType(type).forEach(sensor => {
        ids.add(sensor.sensorId);
      });
    });
    return Array.from(ids);
  }, [sensorTypes]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters: FilterCriteria = {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          sensorTypes: selectedSensorTypes.length > 0 ? selectedSensorTypes : undefined,
          sensorIds: selectedSensorIds.length > 0 ? selectedSensorIds : undefined,
        };

        const response = await getSensorReadings(filters, page, pageSize);
        
        if (response.data && response.data.length > 0) {
          setReadings(response.data);
          setTotal(response.total);
        } else {
          const fallbackResponse = await getSensorReadings(undefined, page, pageSize);
          setReadings(fallbackResponse.data);
          setTotal(fallbackResponse.total);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        
        setTimeout(() => loadData(), 1000);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [startDate, endDate, selectedSensorTypes, selectedSensorIds, page, pageSize]);

  const handleToggleSensorType = (type: SensorType) => {
    const newTypes = selectedSensorTypes.includes(type) 
      ? selectedSensorTypes.filter(t => t !== type) 
      : [...selectedSensorTypes, type];
    setSelectedSensorTypes(newTypes);
    setMultipleParams({ sensorTypes: newTypes });
    setPage(1);
  };

  const handleToggleSensorId = (id: string) => {
    const newIds = selectedSensorIds.includes(id) 
      ? selectedSensorIds.filter(s => s !== id) 
      : [...selectedSensorIds, id];
    setSelectedSensorIds(newIds);
    setMultipleParams({ sensorIds: newIds });
    setPage(1);
  };

  const handleClearFilters = () => {
    const defaultStartDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const defaultEndDate = format(new Date(), 'yyyy-MM-dd');
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setSelectedSensorTypes([]);
    setSelectedSensorIds([]);
    setPage(1);
    clearParams();
  };

  const handleExportCSV = async () => {
    try {
      const filters: FilterCriteria = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        sensorTypes: selectedSensorTypes.length > 0 ? selectedSensorTypes : undefined,
        sensorIds: selectedSensorIds.length > 0 ? selectedSensorIds : undefined,
      };

      const response = await getSensorReadings(filters, 1, 10000); // Get all data
      const csv = exportAsCSV(response.data);
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sensor-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  const handleExportJSON = async () => {
    try {
      const filters: FilterCriteria = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        sensorTypes: selectedSensorTypes.length > 0 ? selectedSensorTypes : undefined,
        sensorIds: selectedSensorIds.length > 0 ? selectedSensorIds : undefined,
      };

      const response = await getSensorReadings(filters, 1, 10000); // Get all data
      const json = exportAsJSON(response.data);
      
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sensor-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export JSON:', err);
    }
  };

  const sortedReadings = useMemo(() => {
    const sorted = [...readings];
    sorted.sort((a, b) => {
      let aVal: any = a[sortBy as keyof SensorReading];
      let bVal: any = b[sortBy as keyof SensorReading];
      
      if (sortBy === 'timestamp') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return sorted;
  }, [readings, sortBy, sortOrder]);

  const totalPages = Math.ceil(total / pageSize);

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
          <h1 className="text-3xl font-bold">Sensor Data Table</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              {(selectedSensorTypes.length > 0 || selectedSensorIds.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setMultipleParams({ startDate: e.target.value });
                    setPage(1);
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
                    setPage(1);
                  }}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sensor Types</label>
              <div className="flex flex-wrap gap-2">
                {sensorTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedSensorTypes.includes(type) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleSensorType(type)}
                  >
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </Button>
                ))}
              </div>
            </div>

            {selectedSensorTypes.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Sensor Instances</label>
                <div className="flex flex-wrap gap-2">
                  {allSensorIds
                    .filter(id => {
                      const sensorType = id.split('-')[0];
                      return selectedSensorTypes.some(t => t.startsWith(sensorType));
                    })
                    .map(id => (
                      <Button
                        key={id}
                        variant={selectedSensorIds.includes(id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleSensorId(id)}
                      >
                        {id}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2 mb-6">
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleExportJSON} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Readings ({total} total)
            </CardTitle>
            <CardDescription>
              Page {page} of {totalPages || 1} • {readings.length} items shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 p-4 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th
                          className="text-left p-3 font-semibold cursor-pointer hover:bg-muted"
                          onClick={() => {
                            if (sortBy === 'sensorId') {
                              const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                              setSortOrder(newOrder);
                              setMultipleParams({ sortBy: 'sensorId', sortOrder: newOrder });
                            } else {
                              setSortBy('sensorId');
                              setSortOrder('asc');
                              setMultipleParams({ sortBy: 'sensorId', sortOrder: 'asc' });
                            }
                          }}
                        >
                          Sensor ID {sortBy === 'sensorId' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="text-left p-3 font-semibold">Type</th>
                        <th
                          className="text-left p-3 font-semibold cursor-pointer hover:bg-muted"
                          onClick={() => {
                            if (sortBy === 'timestamp') {
                              const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                              setSortOrder(newOrder);
                              setMultipleParams({ sortBy: 'timestamp', sortOrder: newOrder });
                            } else {
                              setSortBy('timestamp');
                              setSortOrder('asc');
                              setMultipleParams({ sortBy: 'timestamp', sortOrder: 'asc' });
                            }
                          }}
                        >
                          Timestamp {sortBy === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="text-left p-3 font-semibold">Sensor Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedReadings.map((reading, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{reading.sensorId}</td>
                          <td className="p-3">{reading.sensorType}</td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {new Date(reading.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3 text-xs">
                            <div className="space-y-1">
                              {Object.entries(reading.data).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="font-medium text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                  </span>
                                  <span className="font-mono text-right">
                                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                                    {key === 'chargeLevel' || key === 'humidity' ? '%' : ''}
                                    {key === 'voltage' ? 'mV' : ''}
                                    {key === 'current' ? 'mA' : ''}
                                    {key === 'temperature' || key === 'motorTemperature' || key === 'ambientTemperature' ? '°C' : ''}
                                    {key === 'rpm' ? 'rpm' : ''}
                                    {key === 'torque' ? 'Nm' : ''}
                                    {key === 'currentDraw' ? 'A' : ''}
                                    {key === 'speed' ? 'km/h' : ''}
                                    {key === 'acceleration' ? 'm/s²' : ''}
                                    {key === 'steeringAngle' || key === 'tiltAngle' ? '°' : ''}
                                    {key === 'pressure' ? 'hPa' : ''}
                                    {key === 'lightLevel' ? 'lux' : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} results
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Page {page} of {totalPages || 1}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

