#!/usr/bin/env python3
"""
Weather AI API
FastAPI server for weather predictions
"""

import json
from pathlib import Path
from datetime import datetime
from urllib.request import urlopen
import urllib.parse

# Configuration
OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast"
WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}

# Load model
def load_model():
    model_path = Path(__file__).parent / "model.json"
    if not model_path.exists:
        return None
    with open(model_path) as f:
        return json.load(f)

model_data = load_model()

def predict_temp(hour: int, day_of_week: int = None):
    """Predict temperature based on hour."""
    if not model_data:
        return None
    
    import numpy as np
    weights = model_data["weights"]
    bias = model_data["bias"]
    
    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    dow_sin = np.sin(2 * np.pi * (day_of_week or 0) / 7)
    dow_cos = np.cos(2 * np.pi * (day_of_week or 0) / 7)
    
    X = [hour_sin, hour_cos, dow_sin, dow_cos, hour]
    temp = sum(w * x for w, x in zip(weights, X)) + bias
    
    return round(temp, 1)

def fetch_weather(lat: float, lon: float, days: int = 7):
    """Fetch weather from Open-Meteo."""
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m,weather_code,precipitation",
        "daily": "temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum",
        "timezone": "auto",
        "forecast_days": days,
    }
    
    url = f"{OPEN_METEO_BASE}?{urllib.parse.urlencode(params)}"
    
    with urlopen(url, timeout=30) as response:
        return json.loads(response.read().decode())

# FastAPI app
try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI(title="Weather AI API", version="0.1.0")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    def root():
        return {"message": "Weather AI API", "version": "0.1.0"}
    
    @app.get("/health")
    def health():
        return {"status": "healthy", "model_loaded": model_data is not None}
    
    @app.get("/forecast/{lat}/{lon}")
    def forecast(lat: float, lon: float, days: int = 7):
        """Get weather forecast for location."""
        data = fetch_weather(lat, lon, days)
        
        # Parse daily
        daily = []
        for i, date in enumerate(data["daily"]["time"]):
            code = data["daily"]["weather_code"][i]
            daily.append({
                "date": date,
                "temp_max": data["daily"]["temperature_2m_max"][i],
                "temp_min": data["daily"]["temperature_2m_min"][i],
                "weather_code": code,
                "weather": WEATHER_CODES.get(code, "Unknown"),
                "precipitation": data["daily"]["precipitation_sum"][i],
            })
        
        # Parse hourly (next 24h)
        hourly = []
        for i in range(min(24, len(data["hourly"]["time"]))):
            code = data["hourly"]["weather_code"][i]
            hourly.append({
                "time": data["hourly"]["time"][i],
                "temperature": data["hourly"]["temperature_2m"][i],
                "weather_code": code,
                "weather": WEATHER_CODES.get(code, "Unknown"),
            })
        
        return {
            "location": {"lat": lat, "lon": lon},
            "daily": daily,
            "hourly": hourly,
            "fetched_at": datetime.now().isoformat(),
        }
    
    @app.get("/predict/{hour}")
    def predict(hour: int, day: int = None):
        """Get AI predicted temperature for hour."""
        temp = predict_temp(hour, day)
        if temp is None:
            return {"error": "Model not loaded"}
        return {"hour": hour, "predicted_temp_c": float(temp)}
    
    @app.get("/complete/{lat}/{lon}")
    def complete_forecast(lat: float, lon: float, days: int = 7):
        """Get complete weather: forecast + AI predictions."""
        data = fetch_weather(lat, lon, days)
        
        # Parse daily with AI predictions
        daily = []
        for i, date in enumerate(data["daily"]["time"]):
            code = data["daily"]["weather_code"][i]
            # Get hour from date for prediction
            hour = int(date.split("T")[1].split(":")[0]) if "T" in date else 12
            predicted = predict_temp(hour, datetime.strptime(date, "%Y-%m-%d").weekday())
            daily.append({
                "date": date,
                "temp_max": data["daily"]["temperature_2m_max"][i],
                "temp_min": data["daily"]["temperature_2m_min"][i],
                "weather_code": code,
                "weather": WEATHER_CODES.get(code, "Unknown"),
                "ai_predicted_temp": predicted,
                "precipitation": data["daily"]["precipitation_sum"][i],
            })
        
        return {
            "location": {"lat": lat, "lon": lon},
            "daily": daily,
            "model_score": model_data.get("score") if model_data else None,
            "fetched_at": datetime.now().isoformat(),
        }
    
    if __name__ == "__main__":
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000)


except ImportError:
    print("FastAPI not installed. Install with: pip install fastapi uvicorn")
    print("\nDemo mode - showing API structure:\n")
    print("Routes:")
    print("  GET /                      - API info")
    print("  GET /health                - Health check")  
    print("  GET /forecast/{lat}/{lon}  - Get forecast (with weather descriptions)")
    print("  GET /predict/{hour}        - AI prediction")
    print("  GET /complete/{lat}/{lon}  - Complete: forecast + AI predictions")
    print("\nInstall: pip install --user --break-system-packages fastapi uvicorn")
