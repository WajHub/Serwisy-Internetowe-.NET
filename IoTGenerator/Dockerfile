FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY IoTGenerator.csproj .

RUN dotnet restore "IoTGenerator.csproj"

COPY . .

RUN dotnet publish "IoTGenerator.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime:9.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "IoTGenerator.dll"]