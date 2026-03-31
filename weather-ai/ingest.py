#!/usr/bin/env python3
"""
Weather Data Ingestion Service
Fetches weather data from Open-Meteo API and stores for ML training
"""

import urllib.request
import urllib.parse
import json
from datetime import datetime
from pathlib import Path
import sys

# Configuration
OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast"

# Default location: San Francisco (can be overridden)
DEFAULT_LAT = 37.7749
DEFAULT_LON = -122.4194

# Weather variables to fetch
HOURLY_PARAMS = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "precipitation",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m",
]

DAILY_PARAMS = [
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "weather_code",
]


def fetch_weather(lat: float, lon: float, days: int = 7) -> dict:
    """Fetch weather forecast from Open-Meteo API."""
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ",".join(HOURLY_PARAMS),
        "daily": ",".join(DAILY_PARAMS),
        "timezone": "auto",
        "forecast_days": days,
    }
    
    url = f"{OPEN_METEO_BASE}?{urllib.parse.urlencode(params)}"
    print(f"Fetching weather data for {lat}, {lon}...")
    
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = json.loads(response.read().decode())
        print(f"✓ Retrieved forecast: {days} days")
        return data
    except Exception as e:
        print(f"✗ Error fetching weather: {e}")
        return None


def parse_hourly(data: dict) -> list:
    """Parse hourly data into list of records."""
    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    
    records = []
    for i, time_str in enumerate(times):
        record = {
            "timestamp": time_str,
            "temperature_2m": hourly.get("temperature_2m", [None])[i],
            "relative_humidity_2m": hourly.get("relative_humidity_2m", [None])[i],
            "apparent_temperature": hourly.get("apparent_temperature", [None])[i],
            "precipitation": hourly.get("precipitation", [None])[i],
            "weather_code": hourly.get("weather_code", [None])[i],
            "wind_speed_10m": hourly.get("wind_speed_10m", [None])[i],
            "wind_direction_10m": hourly.get("wind_direction_10m", [None])[i],
        }
        records.append(record)
    
    return records


def parse_daily(data: dict) -> list:
    """Parse daily data into list of records."""
    daily = data.get("daily", {})
    times = daily.get("time", [])
    
    records = []
    for i, time_str in enumerate(times):
        record = {
            "date": time_str,
            "temperature_2m_max": daily.get("temperature_2m_max", [None])[i],
            "temperature_2m_min": daily.get("temperature_2m_min", [None])[i],
            "precipitation_sum": daily.get("precipitation_sum", [None])[i],
            "weather_code": daily.get("weather_code", [None])[i],
        }
        records.append(record)
    
    return records


def get_weather_description(code: int) -> str:
    """Convert WMO weather code to description."""
    codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
    }
    return codes.get(code, "Unknown")


def display_forecast(hourly: list, daily: list):
    """Display formatted weather forecast."""
    print("\n" + "=" * 50)
    print("🌤️  WEATHER FORECAST")
    print("=" * 50)
    
    # Daily summary
    print("\n📅 7-DAY FORECAST:")
    print("-" * 50)
    for day in daily:
        date = day["date"]
        high = day["temperature_2m_max"]
        low = day["temperature_2m_min"]
        desc = get_weather_description(day["weather_code"])
        precip = day["precipitation_sum"]
        print(f"  {date}: {high}°/{low}° {desc} (💧 {precip}mm)")
    
    # Next 24 hours
    print("\n⏰ NEXT 24 HOURS:")
    print("-" * 50)
    for hour in hourly[:24]:
        time = hour["timestamp"][-5:]  # Just HH:MM
        temp = hour["temperature_2m"]
        desc = get_weather_description(hour["weather_code"])
        print(f"  {time}: {temp}° {desc}")


def save_data(data: dict, lat: float, lon: float):
    """Save raw data to file for later ML training."""
    import os
    
    data_dir = Path(__file__).parent / "data"
    data_dir.mkdir(exist_ok=True)
    
    filename = f"weather_{lat}_{lon}_{datetime.now().strftime('%Y%m%d')}.json"
    filepath = data_dir / filename
    
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"✓ Saved raw data to {filepath}")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="AI Weather Data Ingestion")
    parser.add_argument("--lat", type=float, default=DEFAULT_LAT, help="Latitude")
    parser.add_argument("--lon", type=float, default=DEFAULT_LON, help="Longitude")
    parser.add_argument("--days", type=int, default=7, help="Forecast days")
    parser.add_argument("--save", action="store_true", help="Save raw data")
    
    args = parser.parse_args()
    
    # Fetch data
    data = fetch_weather(args.lat, args.lon, args.days)
    
    if data:
        hourly = parse_hourly(data)
        daily = parse_daily(data)
        
        display_forecast(hourly, daily)
        
        if args.save:
            save_data(data, args.lat, args.lon)
        
        print("\n✓ Weather data ingestion complete!")
        return 0
    else:
        print("\n✗ Failed to fetch weather data")
        return 1


if __name__ == "__main__":
    sys.exit(main())
