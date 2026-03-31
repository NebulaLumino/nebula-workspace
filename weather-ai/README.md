# 🌤️ AI Hyperlocal Weather Forecasting

**Status**: Vercel-ready API
**ML Score**: R² = 0.78
**Target**: Consumer-ready hyperlocal weather predictions

## Vision

Personalized, hyperlocal weather forecasting using AI models trained on personal weather station data + public weather APIs. Beat traditional forecasts for your specific microclimate.

## Tech Stack

- **Backend**: Python + FastAPI
- **ML**: Linear regression (MVP), can upgrade to LSTM/Transformer
- **Data**: Open-Meteo API (free, no key required)
- **Deployment**: Vercel-ready

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | API info |
| `GET /health` | Health check + model status |
| `GET /forecast/{lat}/{lon}` | 7-day forecast with weather descriptions |
| `GET /predict/{hour}` | AI temperature prediction |
| `GET /complete/{lat}/{lon}` | Full forecast + AI predictions combined |

## Example Response

```json
{
  "date": "2026-03-16",
  "temp_max": 31.6,
  "temp_min": 13.4,
  "weather_code": 3,
  "weather": "Overcast",
  "ai_predicted_temp": 22.5
}
```

## Run Locally

```bash
cd weather-ai
pip install fastapi uvicorn
python api.py
```

## Deploy to Vercel

```bash
vercel --prod
```

## Features

- [x] Open-Meteo API integration (free, no key)
- [x] 7-day + 24-hour forecast
- [x] Weather code descriptions (WMO standard)
- [x] AI temperature prediction model (R² = 0.78)
- [x] Combined forecast + prediction endpoint
- [x] Vercel deployment ready

## Next Steps

- [ ] Deploy to Vercel (needs valid token)
- [ ] Collect historical data for better model
- [ ] Add humidity/precipitation predictions
- [ ] Add weather station integration

**Last Updated**: 2026-03-16
