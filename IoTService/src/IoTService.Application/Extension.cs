using IoTService.Application.Consumers;
using IoTService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace IoTService.Application;

public static class Extension
{
    public static IServiceCollection AddApplication(this IServiceCollection service)
    {
        service.AddSingleton<BatterySensorService>();

        service.AddSingleton<BatteryConsumer>();
        return service;
    }
}