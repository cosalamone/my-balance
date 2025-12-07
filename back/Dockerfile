# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["MyBalance.API/MyBalance.API.csproj", "MyBalance.API/"]
COPY ["MyBalance.Application/MyBalance.Application.csproj", "MyBalance.Application/"]
COPY ["MyBalance.Core/MyBalance.Core.csproj", "MyBalance.Core/"]
COPY ["MyBalance.Infrastructure/MyBalance.Infrastructure.csproj", "MyBalance.Infrastructure/"]
RUN dotnet restore "MyBalance.API/MyBalance.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/MyBalance.API"
RUN dotnet build "MyBalance.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "MyBalance.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080

# Copy published files
COPY --from=publish /app/publish .

# Set environment to Production
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "MyBalance.API.dll"]
