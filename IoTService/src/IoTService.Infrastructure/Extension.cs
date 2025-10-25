using IoTService.Application.abstractions;
using IoTService.Domain.Abstractions.Repositories;
using IoTService.Infrastructure.data;
using IoTService.Infrastructure.data.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace IoTService.Infrastructure;

public static class Extension
{
    
    public static IServiceCollection AddInfrastructure(this IServiceCollection service, IConfiguration configuration)
    {
        service.Configure<MongoDbSettings>(
            configuration.GetSection("MongoDb"));
        service.AddSingleton<IMongoDatabase>(sp =>
        {
            var options = sp.GetService<IOptions<MongoDbSettings>>();
            return new MongoClient(options?.Value.ConnectionString).GetDatabase(options?.Value.DatabaseName);
        });
        service.AddSingleton<IBatterySensorRepository, BatterySensorRepository>();

        service.Configure<MqttSettings>(
            configuration.GetSection("Mqtt"));
        service.AddSingleton<IMqttListener, MqttListener>();
        return service;
    }
    
}