FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
EXPOSE 8080
EXPOSE 8081
RUN apt update && apt install curl -y

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY "IoTService.Api/IoTService.Api.csproj" "IoTService.Api/"
COPY "IoTService.Api/appsettings.json" "IoTService.Api/"
COPY "IoTService.Api/appsettings.Development.json" "IoTService.Api/"
COPY "IoTService.Application/IoTService.Application.csproj" "IoTService.Application/"
COPY "IoTService.Domain/IoTService.Domain.csproj" "IoTService.Domain/"
COPY "IoTService.Infrastructure/IoTService.Infrastructure.csproj" "IoTService.Infrastructure/"
RUN dotnet restore "IoTService.Api/IoTService.Api.csproj"

WORKDIR "/src/IoTService.Api"
COPY . .

COPY IoTService.Api/appsettings*.json .
RUN dotnet build "IoTService.Api.csproj" --no-restore -c Release -o /app/build /p:UseAppHost=false

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./IoTService.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IoTService.Api.dll"]