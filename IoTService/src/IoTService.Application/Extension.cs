using IoTService.Application.Consumers;
using IoTService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace IoTService.Application;

public static class Extension
{
    public static IServiceCollection AddApplication(this IServiceCollection service)
    {
        service.AddSingleton<BatterySensorService>();
        service.AddSingleton<DriveSystemSensorService>();
        service.AddSingleton<EnvironmentalSensorService>();
        service.AddSingleton<VehicleDynamicSensorService>();

        service.AddSingleton<BatteryConsumer>();
        service.AddSingleton<DriveSystemConsumer>();
        service.AddSingleton<EnvironmentalConsumer>();
        service.AddSingleton<VehicleDynamicsConsumer>();
        return service;
    }
}