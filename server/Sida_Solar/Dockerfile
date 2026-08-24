FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["Sida_Solar.csproj", "./"]
RUN dotnet restore "Sida_Solar.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "Sida_Solar.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Sida_Solar.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Sida_Solar.dll"]

