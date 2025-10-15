namespace IoTService.Infrastructure.data;

public class MqttSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string ClientId { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public List<string> Topics { get; set; } = new();
}