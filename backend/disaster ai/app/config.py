"""
config.py
---------
All configuration / constants for the Disaster AI project.
Edit values here to tune the model without touching app.py.
"""

# ---------------------------------------------------------------------------
# Data file
# ---------------------------------------------------------------------------
CSV_PATH = "data/karnataka_disaster_data.csv"

# ---------------------------------------------------------------------------
# Weather API (Open-Meteo — FREE, no API key required)
# Docs: https://open-meteo.com/en/docs
# ---------------------------------------------------------------------------
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"
WEATHER_PARAMS = (
    "temperature_2m,relative_humidity_2m,"
    "precipitation,rain,wind_speed_10m,weather_code"
)
TIMEZONE = "Asia/Kolkata"
REQUEST_TIMEOUT = 10  # seconds

# ---------------------------------------------------------------------------
# Historical score weights (must sum to 1.0)
# ---------------------------------------------------------------------------
HISTORICAL_WEIGHTS = {
    "flood_risk":       0.35,
    "cyclone_risk":     0.20,
    "earthquake_risk":  0.15,
    "drought_risk":     0.10,
    "historical_score": 0.20,
}

# Final score weights
HIST_WEIGHT = 0.5
WEATHER_WEIGHT = 0.5

# ---------------------------------------------------------------------------
# Weather scoring thresholds
# ---------------------------------------------------------------------------
RAIN_THRESHOLDS = [(30, 6), (15, 4), (5, 2), (1, 1)]  # mm/hr -> points
WIND_THRESHOLDS = [(60, 4), (40, 3), (25, 2), (15, 1)]  # km/h -> points

WEATHER_CATEGORY_POINTS = {
    "Thunderstorm": 4,
    "Rain":         2,
    "Snow":         2,
    "Fog":          1,
}

HIGH_HUMIDITY_BONUS = {
    "humidity": 90,
    "rain": 5,
    "points": 1
}

# ---------------------------------------------------------------------------
# Classification thresholds
# ---------------------------------------------------------------------------
SAFE_MAX = 3.5
RISK_MAX = 6.0

# ---------------------------------------------------------------------------
# WMO weather code mapping
# ---------------------------------------------------------------------------
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

# ---------------------------------------------------------------------------
# District aliases
# ---------------------------------------------------------------------------
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