"""
Disaster prediction module integrating the ML model from the disaster ai folder.
Wraps the neural network + clustering model for use as a FastAPI service.
"""

import csv
import datetime
import threading
from pathlib import Path
from typing import Optional

import numpy as np
import requests
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

from tensorflow.keras import layers, Sequential
from tensorflow.keras.optimizers import Adam

# ── Configuration ────────────────────────────────────────────────────────────

_BASE_DIR = Path(__file__).parent.parent.parent  # → backend/
CSV_PATH = _BASE_DIR / "disaster ai" / "data" / "karnataka_disaster_data.csv"

WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"
WEATHER_PARAMS = (
    "temperature_2m,relative_humidity_2m,"
    "precipitation,rain,wind_speed_10m,weather_code"
)
TIMEZONE = "Asia/Kolkata"
REQUEST_TIMEOUT = 10

HISTORICAL_WEIGHTS = {
    "flood_risk": 0.35,
    "cyclone_risk": 0.20,
    "earthquake_risk": 0.15,
    "drought_risk": 0.10,
    "historical_score": 0.20,
}

HIST_WEIGHT = 0.5
WEATHER_WEIGHT = 0.5

RAIN_THRESHOLDS = [(30, 6), (15, 4), (5, 2), (1, 1)]
WIND_THRESHOLDS = [(60, 4), (40, 3), (25, 2), (15, 1)]

WEATHER_CATEGORY_POINTS = {"Thunderstorm": 4, "Rain": 2, "Snow": 2, "Fog": 1}

SAFE_MAX = 3.5
RISK_MAX = 6.0

WEATHER_CODE_MAP = {
    0: "Clear", 1: "Clear", 2: "Clouds", 3: "Clouds",
    45: "Fog", 48: "Fog",
    51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
    61: "Rain", 63: "Rain", 65: "Rain",
    66: "Rain", 67: "Rain",
    71: "Snow", 73: "Snow", 75: "Snow", 77: "Snow",
    80: "Rain", 81: "Rain", 82: "Rain",
    85: "Snow", 86: "Snow",
    95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
}

DISTRICT_ALIASES = {
    "bangalore": "Bengaluru Urban",
    "bengaluru": "Bengaluru Urban",
    "mysore": "Mysuru",
    "mangalore": "Dakshina Kannada",
    "mangaluru": "Dakshina Kannada",
    "hubli": "Dharwad",
    "hubballi": "Dharwad",
    "gulbarga": "Kalaburagi",
    "bijapur": "Vijayapura",
    "bellary": "Ballari",
    "tumkur": "Tumakuru",
    "shimoga": "Shivamogga",
    "chikmagalur": "Chikkamagaluru",
    "coorg": "Kodagu",
    "madikeri": "Kodagu",
    "karwar": "Uttara Kannada",
}

# ── Neural Network ────────────────────────────────────────────────────────────

class DisasterNeuralNetwork:
    def __init__(self, input_dim=5):
        self.input_dim = input_dim
        self.model = self._build_model()
        self.scaler = StandardScaler()
        self.is_trained = False

    def _build_model(self):
        model = Sequential([
            layers.Input(shape=(self.input_dim,)),
            layers.Dense(64, activation="relu"),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            layers.Dense(32, activation="relu"),
            layers.BatchNormalization(),
            layers.Dropout(0.2),
            layers.Dense(16, activation="relu"),
            layers.Dropout(0.2),
            layers.Dense(3, activation="softmax"),
        ])
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"],
        )
        return model

    def train(self, districts_data):
        X, y = [], []
        for d in districts_data.values():
            features = [
                d["flood_risk"], d["cyclone_risk"],
                d["earthquake_risk"], d["drought_risk"],
                d["historical_score"],
            ]
            X.append(features)
            score = (
                0.35 * d["flood_risk"] + 0.20 * d["cyclone_risk"] +
                0.15 * d["earthquake_risk"] + 0.10 * d["drought_risk"] +
                0.20 * d["historical_score"]
            )
            y.append(0 if score < 3.5 else 1 if score < 6.0 else 2)

        X = np.array(X)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, np.array(y), epochs=50, batch_size=4,
                       verbose=0, validation_split=0.2)
        self.is_trained = True

    def predict(self, features):
        if not self.is_trained:
            return None, None
        features_scaled = self.scaler.transform([features])
        preds = self.model.predict(features_scaled, verbose=0)
        risk_level = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0])) * 100
        return risk_level, confidence


# ── Clustering ────────────────────────────────────────────────────────────────

class DisasterClusterer:
    def __init__(self, n_clusters=4):
        self.n_clusters = n_clusters
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        self.scaler = StandardScaler()

    def fit(self, districts_data):
        X = [
            [d["flood_risk"], d["cyclone_risk"], d["earthquake_risk"], d["drought_risk"]]
            for d in districts_data.values()
        ]
        X_scaled = self.scaler.fit_transform(np.array(X))
        self.kmeans.fit(X_scaled)

    def find_similar_districts(self, features, districts_data, k=3):
        features_scaled = self.scaler.transform([features[:4]])[0]
        cluster = self.kmeans.predict([features_scaled])[0]

        similar = []
        current_key = features[4] if len(features) > 4 else ""
        for name, d in districts_data.items():
            d_f = [d["flood_risk"], d["cyclone_risk"], d["earthquake_risk"], d["drought_risk"]]
            d_scaled = self.scaler.transform([d_f])[0]
            if self.kmeans.predict([d_scaled])[0] == cluster and name != current_key:
                distance = float(np.linalg.norm(features_scaled - d_scaled))
                similar.append({"key": name, "district": d["district"], "distance": round(distance, 3)})

        return sorted(similar, key=lambda x: x["distance"])[:k]


# ── Singleton with lazy init ──────────────────────────────────────────────────

_nn_model: Optional[DisasterNeuralNetwork] = None
_clusterer: Optional[DisasterClusterer] = None
_districts: Optional[dict] = None
_init_lock = threading.Lock()


def _load():
    global _nn_model, _clusterer, _districts

    districts = {}
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        non_blank = (line for line in f if line.strip())
        for row in csv.DictReader(non_blank):
            if not row.get("district"):
                continue
            try:
                districts[row["district"].lower()] = {
                    "district": row["district"],
                    "lat": float(row["lat"]),
                    "lon": float(row["lon"]),
                    "flood_risk": float(row["flood_risk"]),
                    "cyclone_risk": float(row["cyclone_risk"]),
                    "earthquake_risk": float(row["earthquake_risk"]),
                    "drought_risk": float(row["drought_risk"]),
                    "historical_score": float(row["historical_score"]),
                }
            except (ValueError, TypeError):
                continue

    nn = DisasterNeuralNetwork()
    nn.train(districts)

    cl = DisasterClusterer()
    cl.fit(districts)

    _districts = districts
    _nn_model = nn
    _clusterer = cl


def _ensure_loaded():
    global _nn_model, _clusterer, _districts
    if _districts is None:
        with _init_lock:
            if _districts is None:
                _load()


# ── Helpers ───────────────────────────────────────────────────────────────────

def _parse_coordinates(user_input: str):
    try:
        parts = user_input.replace(",", " ").split()
        if len(parts) >= 2:
            lat, lon = float(parts[0]), float(parts[1])
            if -90 <= lat <= 90 and -180 <= lon <= 180:
                return lat, lon
    except (ValueError, IndexError):
        pass
    return None, None


def _nearest_district(lat, lon, districts):
    min_dist = float("inf")
    nearest = None
    for key, d in districts.items():
        dist = np.sqrt((d["lat"] - lat) ** 2 + (d["lon"] - lon) ** 2)
        if dist < min_dist:
            min_dist = dist
            nearest = key
    return nearest, float(min_dist)


def _resolve(name: str, districts):
    lat, lon = _parse_coordinates(name)
    if lat is not None:
        key, dist = _nearest_district(lat, lon, districts)
        d = districts[key]
        return key, True, lat, lon, round(dist, 4)

    key = name.lower()
    if key in districts:
        d = districts[key]
        return key, False, d["lat"], d["lon"], 0.0

    alias_key = DISTRICT_ALIASES.get(key, "").lower()
    if alias_key in districts:
        d = districts[alias_key]
        return alias_key, False, d["lat"], d["lon"], 0.0

    return None, False, None, None, None


def _fetch_weather(lat, lon):
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": WEATHER_PARAMS,
        "timezone": TIMEZONE,
    }
    try:
        r = requests.get(WEATHER_API_URL, params=params, timeout=REQUEST_TIMEOUT)
        data = r.json()["current"]
        code = data.get("weather_code", 0)
        return {
            "temperature": data.get("temperature_2m"),
            "rainfall": data.get("rain", 0),
            "wind": data.get("wind_speed_10m", 0),
            "humidity": data.get("relative_humidity_2m", 0),
            "weather": WEATHER_CODE_MAP.get(code, "Clear"),
        }
    except Exception:
        return None


def _hist_score(d):
    w = HISTORICAL_WEIGHTS
    return (
        w["flood_risk"] * d["flood_risk"] +
        w["cyclone_risk"] * d["cyclone_risk"] +
        w["earthquake_risk"] * d["earthquake_risk"] +
        w["drought_risk"] * d["drought_risk"] +
        w["historical_score"] * d["historical_score"]
    )


def _weather_score(w):
    score = 0
    for t, pts in RAIN_THRESHOLDS:
        if w["rainfall"] >= t:
            score += pts
            break
    for t, pts in WIND_THRESHOLDS:
        if w["wind"] >= t:
            score += pts
            break
    score += WEATHER_CATEGORY_POINTS.get(w["weather"], 0)
    return min(score, 10)


def _classify(score):
    if score < SAFE_MAX:
        return "SAFE"
    elif score < RISK_MAX:
        return "TRAVEL AT YOUR OWN RISK"
    return "HIGH RISK"


def _seasonal_risk():
    month = datetime.datetime.now().month
    multiplier = 1.0
    info = []
    if month in [6, 7, 8, 9]:
        multiplier += 0.3
        info.append("Monsoon Season - Flood risk +30%")
    if month in [10, 11, 4, 5]:
        multiplier += 0.2
        info.append("Cyclone Season - Storm risk +20%")
    if month in [3, 4, 5]:
        multiplier += 0.15
        info.append("Summer Season - Drought risk +15%")
    return multiplier, info


def _ai_insights(d, final_score, nn_confidence):
    insights = []
    if d["flood_risk"] >= 7:
        insights.append("High flood risk detected - avoid travel during monsoon")
    if d["cyclone_risk"] >= 6:
        insights.append("Cyclone risk is significant - monitor weather alerts")
    if d["earthquake_risk"] >= 5:
        insights.append("Earthquake zone - ensure building safety awareness")
    if d["drought_risk"] >= 6:
        insights.append("Drought-prone area - water scarcity expected")

    if final_score < 2:
        insights.append(f"Very safe region - travel recommended (NN Confidence: {nn_confidence:.1f}%)")
    elif final_score < 4:
        insights.append(f"Generally safe - standard precautions advised (NN Confidence: {nn_confidence:.1f}%)")
    elif final_score < 6:
        insights.append(f"Moderate risk - review disaster preparedness (NN Confidence: {nn_confidence:.1f}%)")
    else:
        insights.append(f"High risk area - check with authorities (NN Confidence: {nn_confidence:.1f}%)")
    return insights


# ── Public API ────────────────────────────────────────────────────────────────

def get_all_districts() -> list[str]:
    """Return list of all available district names."""
    _ensure_loaded()
    return [d["district"] for d in _districts.values()]


def predict_disaster_risk(location: str) -> dict:
    """
    Predict disaster risk for a district name or lat,lon coordinates.
    Returns a structured dict suitable for JSON serialisation.
    """
    _ensure_loaded()

    key, is_coord, input_lat, input_lon, coord_dist = _resolve(location, _districts)
    if key is None:
        return {"error": f"Location '{location}' not found. Try a Karnataka district name or lat,lon coordinates."}

    d = _districts[key]
    hist = _hist_score(d)
    weather = _fetch_weather(d["lat"], d["lon"])

    if weather:
        w_score = _weather_score(weather)
        final = HIST_WEIGHT * hist + WEATHER_WEIGHT * w_score
    else:
        w_score = None
        final = hist

    features = [d["flood_risk"], d["cyclone_risk"], d["earthquake_risk"],
                d["drought_risk"], d["historical_score"]]
    nn_risk_level, nn_confidence = _nn_model.predict(features)

    similar = _clusterer.find_similar_districts(features + [key], _districts, k=3)

    seasonal_mult, seasonal_info = _seasonal_risk()
    adjusted_score = final * seasonal_mult

    risk_labels = ["SAFE", "MODERATE RISK", "HIGH RISK"]

    searched_as = location.strip()
    is_alias = (not is_coord and searched_as.lower() != d["district"].lower())

    return {
        "district": d["district"],
        "searched_as": searched_as,
        "is_alias": is_alias,
        "lat": d["lat"],
        "lon": d["lon"],
        "input_lat": input_lat,
        "input_lon": input_lon,
        "is_coordinate_input": is_coord,
        "coordinate_distance": coord_dist,
        "disaster_risks": {
            "flood_risk": d["flood_risk"],
            "cyclone_risk": d["cyclone_risk"],
            "earthquake_risk": d["earthquake_risk"],
            "drought_risk": d["drought_risk"],
            "historical_score": d["historical_score"],
        },
        "historical_score": round(hist, 3),
        "weather_data": weather,
        "weather_score": round(w_score, 3) if w_score is not None else None,
        "final_score": round(final, 3),
        "adjusted_seasonal_score": round(adjusted_score, 3),
        "risk": _classify(final),
        "nn_risk_level": nn_risk_level,
        "nn_risk_label": risk_labels[nn_risk_level] if nn_risk_level is not None else None,
        "nn_confidence": round(nn_confidence, 2) if nn_confidence is not None else None,
        "similar_districts": similar,
        "seasonal_info": seasonal_info,
        "ai_insights": _ai_insights(d, final, nn_confidence or 0),
    }
