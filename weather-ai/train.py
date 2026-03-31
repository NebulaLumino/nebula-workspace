#!/usr/bin/env python3
"""
Weather Prediction Model
Simple linear regression for temperature forecasting using numpy only
"""

import json
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
import sys


def load_data(data_dir: str = None):
    """Load saved weather data."""
    if data_dir is None:
        data_dir = Path(__file__).parent / "data"
    
    files = list(Path(data_dir).glob("weather_*.json"))
    if not files:
        return None
    
    # Load most recent
    with open(files[-1]) as f:
        return json.load(f)


def prepare_features(hourly_data: list) -> tuple:
    """
    Prepare features for prediction.
    Using time-based features: hour of day, day of week
    """
    X = []
    y = []
    
    for i, record in enumerate(hourly_data):
        temp = record.get("temperature_2m")
        if temp is None:
            continue
        
        # Parse timestamp
        ts = record["timestamp"]
        hour = int(ts[11:13])
        day_of_week = datetime.fromisoformat(ts.replace("Z", "+00:00")).weekday()
        
        # Cyclical encoding for hour (sin/cos)
        hour_sin = np.sin(2 * np.pi * hour / 24)
        hour_cos = np.cos(2 * np.pi * hour / 24)
        
        # Cyclical encoding for day
        dow_sin = np.sin(2 * np.pi * day_of_week / 7)
        dow_cos = np.cos(2 * np.pi * day_of_week / 7)
        
        X.append([hour_sin, hour_cos, dow_sin, dow_cos, hour])
        y.append(temp)
    
    return np.array(X), np.array(y)


class LinearRegression:
    """Simple linear regression using normal equation."""
    
    def __init__(self):
        self.weights = None
        self.bias = None
    
    def fit(self, X, y):
        """Fit the model."""
        # Add bias term
        X_b = np.c_[np.ones((X.shape[0], 1)), X]
        
        # Normal equation: theta = (X^T X)^-1 X^T y
        # Using pseudoinverse for numerical stability
        theta = np.linalg.pinv(X_b.T @ X_b) @ X_b.T @ y
        
        self.bias = theta[0]
        self.weights = theta[1:]
    
    def predict(self, X):
        """Predict."""
        return X @ self.weights + self.bias
    
    def score(self, X, y):
        """Calculate R² score."""
        y_pred = self.predict(X)
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        return 1 - (ss_res / ss_tot)


def train_model():
    """Train the weather prediction model."""
    print("Loading weather data...")
    data = load_data()
    
    if not data:
        print("No data found. Run ingest.py first!")
        return False
    
    hourly = data.get("hourly", {}).get("time", [])
    records = []
    for i, ts in enumerate(hourly):
        record = {
            "timestamp": ts,
            "temperature_2m": data["hourly"].get("temperature_2m", [None])[i],
        }
        records.append(record)
    
    print(f"Loaded {len(records)} hourly records")
    
    # Prepare features
    X, y = prepare_features(records)
    print(f"Training on {len(X)} samples with {X.shape[1]} features")
    
    # Train
    model = LinearRegression()
    model.fit(X, y)
    
    # Evaluate
    score = model.score(X, y)
    print(f"Training R² score: {score:.4f}")
    
    # Save model
    model_data = {
        "weights": model.weights.tolist(),
        "bias": float(model.bias),
        "score": float(score),
        "trained_at": datetime.now().isoformat(),
    }
    
    save_path = Path(__file__).parent / "model.json"
    with open(save_path, "w") as f:
        json.dump(model_data, f, indent=2)
    
    print(f"✓ Model saved to {save_path}")
    return True


def predict_temp(hour: int, day_of_week: int = None):
    """Predict temperature for a given hour."""
    # Load model
    model_path = Path(__file__).parent / "model.json"
    if not model_path.exists():
        print("No model found. Run train.py first!")
        return None
    
    with open(model_path) as f:
        model_data = json.load(f)
    
    weights = np.array(model_data["weights"])
    bias = model_data["bias"]
    
    # Prepare features
    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    dow_sin = np.sin(2 * np.pi * (day_of_week or 0) / 7)
    dow_cos = np.cos(2 * np.pi * (day_of_week or 0) / 7)
    
    X = np.array([[hour_sin, hour_cos, dow_sin, dow_cos, hour]])
    temp = ((X @ weights) + bias).item()
    
    return temp


def demo_prediction():
    """Demo: predict temperatures for today."""
    print("\n" + "=" * 50)
    print("🔮 TEMPERATURE PREDICTIONS")
    print("=" * 50)
    
    now = datetime.now()
    print(f"Predictions for {now.strftime('%Y-%m-%d')}:")
    print("-" * 30)
    
    for hour in range(6, 23, 2):  # Every 2 hours from 6am to 10pm
        temp = predict_temp(hour, now.weekday())
        if temp is not None:
            temp_val = float(temp[0]) if hasattr(temp, '__iter__') else float(temp)
            print(f"  {hour:02d}:00 → {temp_val:.1f}°C")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Weather Prediction Model")
    parser.add_argument("--train", action="store_true", help="Train the model")
    parser.add_argument("--predict", action="store_true", help="Run predictions")
    parser.add_argument("--hour", type=int, help="Hour to predict (0-23)")
    
    args = parser.parse_args()
    
    if args.train:
        train_model()
    elif args.predict:
        demo_prediction()
    elif args.hour is not None:
        temp = predict_temp(args.hour)
        if temp:
            print(f"Hour {args.hour}: {temp:.1f}°C")
    else:
        # Default: train then predict
        if train_model():
            demo_prediction()
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
