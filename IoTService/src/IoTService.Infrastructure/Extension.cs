using IoTService.Infrastructure.data;
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
        service.AddSingleton<IMongoClient>(sp =>
        {
            var options = sp.GetService<IOptions<MongoDbSettings>>();
            return new MongoClient(options?.Value.ConnectionString);
        });
        return service;
    }
    
}