import csv
import requests
import config
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans

# TensorFlow/Keras for Neural Networks
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, Sequential
from tensorflow.keras.optimizers import Adam

# ---------------------------
# NEURAL NETWORK MODEL
# ---------------------------
class DisasterNeuralNetwork:
    """Deep Learning Model for Disaster Risk Prediction"""
    def __init__(self, input_dim=5):
        self.input_dim = input_dim
        self.model = self._build_model()
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def _build_model(self):
        """Build a deep neural network with multiple layers"""
        model = Sequential([
            # Input layer with 5 features
            layers.Input(shape=(self.input_dim,)),
            
            # First hidden layer with batch normalization
            layers.Dense(64, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            
            # Second hidden layer
            layers.Dense(32, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.2),
            
            # Third hidden layer
            layers.Dense(16, activation='relu'),
            layers.Dropout(0.2),
            
            # Output layer (3 classes: safe, moderate, high risk)
            layers.Dense(3, activation='softmax')
        ])
        
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        return model
    
    def train(self, districts_data):
        """Train neural network on disaster data"""
        X = []
        y = []
        
        for d in districts_data.values():
            features = [
                d["flood_risk"],
                d["cyclone_risk"],
                d["earthquake_risk"],
                d["drought_risk"],
                d["historical_score"]
            ]
            X.append(features)
            
            # Create risk level
            score = (0.35 * d["flood_risk"] + 0.20 * d["cyclone_risk"] + 
                    0.15 * d["earthquake_risk"] + 0.10 * d["drought_risk"] + 
                    0.20 * d["historical_score"])
            if score < 3.5:
                risk_level = 0  # Safe
            elif score < 6.0:
                risk_level = 1  # Moderate
            else:
                risk_level = 2  # High
            y.append(risk_level)
        
        X = np.array(X)
        y = np.array(y)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train neural network
        self.model.fit(
            X_scaled, y,
            epochs=50,
            batch_size=4,
            verbose=0,
            validation_split=0.2
        )
        self.is_trained = True
    
    def predict(self, features):
        """Predict risk level and confidence"""
        if not self.is_trained:
            return None, None
        
        features_scaled = self.scaler.transform([features])
        predictions = self.model.predict(features_scaled, verbose=0)
        
        risk_level = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0])) * 100
        
        return risk_level, confidence


# ---------------------------
# PATTERN CLUSTERING
# ---------------------------
class DisasterClusterer:
    """Cluster districts by similar disaster patterns"""
    def __init__(self, n_clusters=4):
        self.n_clusters = n_clusters
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        self.scaler = StandardScaler()
    
    def fit(self, districts_data):
        """Fit clustering model"""
        X = []
        for d in districts_data.values():
            features = [
                d["flood_risk"],
                d["cyclone_risk"],
                d["earthquake_risk"],
                d["drought_risk"],
            ]
            X.append(features)
        
        X = np.array(X)
        X_scaled = self.scaler.fit_transform(X)
        self.kmeans.fit(X_scaled)
    
    def find_similar_districts(self, features, districts_data, k=3):
        """Find districts with similar disaster patterns"""
        features_scaled = self.scaler.transform([features[:4]])[0]
        cluster = self.kmeans.predict([features_scaled])[0]
        
        similar = []
        for name, d in districts_data.items():
            d_features = [d["flood_risk"], d["cyclone_risk"], 
                         d["earthquake_risk"], d["drought_risk"]]
            d_scaled = self.scaler.transform([d_features])[0]
            d_cluster = self.kmeans.predict([d_scaled])[0]
            
            if d_cluster == cluster and name != features[-1].lower():
                distance = np.linalg.norm(features_scaled - d_scaled)
                similar.append((name, distance, d["district"]))
        
        return sorted(similar, key=lambda x: x[1])[:k]


# Initialize global models
nn_model = DisasterNeuralNetwork()
clusterer = DisasterClusterer()
ml_model = None  # Will be initialized in load_districts


# ---------------------------
# SEASONAL RISK ANALYSIS
# ---------------------------
def get_seasonal_risk(month=None):
    """Get seasonal disaster risks based on monsoon patterns"""
    import datetime
    
    if month is None:
        month = datetime.datetime.now().month
    
    seasonal_risks = {
        "monsoon_months": [6, 7, 8, 9],  # June-September
        "cyclone_months": [10, 11, 4, 5],  # Oct-Nov, Apr-May
        "drought_months": [3, 4, 5],  # Mar-May
    }
    
    seasonal_multiplier = 1.0
    season_info = []
    
    if month in seasonal_risks["monsoon_months"]:
        seasonal_multiplier += 0.3
        season_info.append("🌧️ Monsoon Season - Flood risk +30%")
    
    if month in seasonal_risks["cyclone_months"]:
        seasonal_multiplier += 0.2
        season_info.append("🌪️ Cyclone Season - Storm risk +20%")
    
    if month in seasonal_risks["drought_months"]:
        seasonal_multiplier += 0.15
        season_info.append("☀️ Summer Season - Drought risk +15%")
    
    return seasonal_multiplier, season_info


# ---------------------------
# LOAD CSV
# ---------------------------
def load_districts():
    global ml_model
    
    districts = {}
    with open(config.CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get("district") or None in row:
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
    
    # Train neural network
    nn_model.train(districts)
    
    # Fit clustering model
    clusterer.fit(districts)
    
    return districts


# ---------------------------
# COORDINATE AND DISTRICT RESOLUTION
# ---------------------------
def parse_coordinates(user_input):
    """Parse coordinate input (lat,lon or lat lon)"""
    try:
        # Try splitting by comma or space
        parts = user_input.replace(',', ' ').split()
        if len(parts) >= 2:
            lat = float(parts[0])
            lon = float(parts[1])
            # Validate coordinate ranges
            if -90 <= lat <= 90 and -180 <= lon <= 180:
                return lat, lon
    except (ValueError, IndexError):
        pass
    return None, None


def find_nearest_district(lat, lon, districts):
    """Find the nearest district to given coordinates"""
    min_distance = float('inf')
    nearest_key = None
    
    for key, d in districts.items():
        # Calculate Euclidean distance
        distance = np.sqrt((d["lat"] - lat)**2 + (d["lon"] - lon)**2)
        if distance < min_distance:
            min_distance = distance
            nearest_key = key
    
    return nearest_key, min_distance


def resolve_district(name, districts):
    """Resolve district by name or coordinates"""
    # Try to parse as coordinates first
    lat, lon = parse_coordinates(name)
    
    if lat is not None and lon is not None:
        # Input is coordinates
        nearest_key, distance = find_nearest_district(lat, lon, districts)
        return nearest_key, True, lat, lon, distance
    
    # Try exact match with name
    key = name.lower()
    if key in districts:
        d = districts[key]
        return key, False, d["lat"], d["lon"], 0
    
    # Check aliases
    if key in config.DISTRICT_ALIASES:
        alias = config.DISTRICT_ALIASES[key].lower()
        if alias in districts:
            d = districts[alias]
            return alias, False, d["lat"], d["lon"], 0
    
    return None, False, None, None, None


# ---------------------------
# WEATHER FETCH
# ---------------------------
def fetch_weather(lat, lon):
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": config.WEATHER_PARAMS,
        "timezone": config.TIMEZONE,
    }
    
    try:
        r = requests.get(config.WEATHER_API_URL, params=params, timeout=config.REQUEST_TIMEOUT)
        data = r.json()["current"]
        code = data.get("weather_code", 0)
        
        return {
            "temperature": data.get("temperature_2m", "N/A"),
            "rainfall": data.get("rain", 0),
            "wind": data.get("wind_speed_10m", 0),
            "humidity": data.get("relative_humidity_2m", 0),
            "weather": config.WEATHER_CODE_MAP.get(code, "Clear"),
        }
    except:
        return None


# ---------------------------
# SCORING
# ---------------------------
def historical_score(d):
    w = config.HISTORICAL_WEIGHTS
    return (
        w["flood_risk"] * d["flood_risk"] +
        w["cyclone_risk"] * d["cyclone_risk"] +
        w["earthquake_risk"] * d["earthquake_risk"] +
        w["drought_risk"] * d["drought_risk"] +
        w["historical_score"] * d["historical_score"]
    )


def weather_score(w):
    score = 0
    
    for t, pts in config.RAIN_THRESHOLDS:
        if w["rainfall"] >= t:
            score += pts
            break
    
    for t, pts in config.WIND_THRESHOLDS:
        if w["wind"] >= t:
            score += pts
            break
    
    score += config.WEATHER_CATEGORY_POINTS.get(w["weather"], 0)
    return min(score, 10)


def classify(score):
    if score < config.SAFE_MAX:
        return "SAFE"
    elif score < config.RISK_MAX:
        return "TRAVEL AT YOUR OWN RISK"
    else:
        return "HIGH RISK"


def get_risk_color(score):
    """Return ANSI color code based on risk score"""
    if score < 2.5:
        return "\033[92m"  # Green
    elif score < 5.0:
        return "\033[93m"  # Yellow
    elif score < 7.5:
        return "\033[91m"  # Red
    else:
        return "\033[41m"  # Red background


def create_progress_bar(score, max_score=10, width=20):
    """Create a visual progress bar for scores"""
    filled = int((score / max_score) * width)
    bar = "█" * filled + "░" * (width - filled)
    color = get_risk_color(score)
    reset = "\033[0m"
    return f"{color}[{bar}]{reset} {score:.2f}/10"


# ---------------------------
# RISK BREAKDOWN
# ---------------------------
def get_risk_breakdown(d):
    """Analyze which disaster types pose the biggest threat"""
    risks = {
        "🌊 Flood": d["flood_risk"],
        "🌪️ Cyclone": d["cyclone_risk"],
        "🏚️ Earthquake": d["earthquake_risk"],
        "🏜️ Drought": d["drought_risk"],
    }
    return sorted(risks.items(), key=lambda x: x[1], reverse=True)


def get_ai_insights(d, hist_score, w_score, final_score, nn_confidence):
    """Generate AI-based insights with neural network confidence"""
    insights = []
    
    # Historical insights
    if d["flood_risk"] >= 7:
        insights.append("⚠️  High flood risk detected - avoid travel during monsoon")
    if d["cyclone_risk"] >= 6:
        insights.append("⚠️  Cyclone risk is significant - monitor weather alerts")
    if d["earthquake_risk"] >= 5:
        insights.append("⚠️  Earthquake zone - ensure building safety awareness")
    if d["drought_risk"] >= 6:
        insights.append("⚠️  Drought-prone area - water scarcity expected")
    
    # Combined insights with neural network confidence
    if final_score < 2:
        insights.append(f"✅ Very safe region - travel recommended (NN Confidence: {nn_confidence:.1f}%)")
    elif final_score < 4:
        insights.append(f"✅ Generally safe - standard precautions advised (NN Confidence: {nn_confidence:.1f}%)")
    elif final_score < 6:
        insights.append(f"⚠️  Moderate risk - review disaster preparedness (NN Confidence: {nn_confidence:.1f}%)")
    else:
        insights.append(f"🚨 High risk area - check with authorities (NN Confidence: {nn_confidence:.1f}%)")
    
    return insights


# ---------------------------
# MAIN PREDICT
# ---------------------------
def predict(name, districts):
    key, is_coordinate, input_lat, input_lon, coord_distance = resolve_district(name, districts)
    
    if key is None:
        return {"error": "District not found"}
    
    d = districts[key]
    
    hist = historical_score(d)
    w = fetch_weather(d["lat"], d["lon"])
    
    if w:
        w_score = weather_score(w)
        final = (config.HIST_WEIGHT * hist) + (config.WEATHER_WEIGHT * w_score)
    else:
        w_score = None
        final = hist
    
    # Neural network prediction
    features = [d["flood_risk"], d["cyclone_risk"], d["earthquake_risk"], 
                d["drought_risk"], d["historical_score"]]
    nn_risk_level, nn_confidence = nn_model.predict(features)
    
    # Find similar districts
    similar = clusterer.find_similar_districts(
        features + [key], districts, k=3
    )
    
    # Seasonal analysis
    seasonal_multiplier, seasonal_info = get_seasonal_risk()
    adjusted_score = final * seasonal_multiplier
    
    return {
        "district": d["district"],
        "lat": d["lat"],
        "lon": d["lon"],
        "input_lat": input_lat,
        "input_lon": input_lon,
        "is_coordinate_input": is_coordinate,
        "coordinate_distance": coord_distance,
        "disaster_risks": d,
        "historical_score": hist,
        "weather_data": w,
        "weather_score": w_score,
        "final_score": final,
        "adjusted_seasonal_score": adjusted_score,
        "risk": classify(final),
        "nn_risk_level": nn_risk_level,
        "nn_confidence": nn_confidence,
        "similar_districts": similar,
        "seasonal_info": seasonal_info
    }


# ---------------------------
# DISPLAY RESULT
# ---------------------------
def display_result(result):
    """Display results with neural network analysis and seasonal info"""
    if "error" in result:
        print(f"\n❌ Error: {result['error']}\n")
        return
    
    reset = "\033[0m"
    bold = "\033[1m"
    
    print(f"\n{bold}{'─'*75}{reset}")
    print(f"{bold}🧠 AI-POWERED DISASTER RISK ASSESSMENT (Neural Network Analysis){reset}")
    print(f"{bold}{'─'*75}{reset}\n")
    
    # District info
    print(f"{bold}📍 DISTRICT: {reset}{result['district']}")
    print(f"   Location: ({result['lat']}, {result['lon']})")
    
    # If coordinates were provided, show the mapping
    if result['is_coordinate_input']:
        print(f"\n{bold}📌 COORDINATE LOOKUP:{reset}")
        print(f"   Your Input: ({result['input_lat']}, {result['input_lon']})")
        print(f"   Distance to Nearest District: {result['coordinate_distance']:.2f}°")
        print(f"   Matched to: {result['district']} ✓")
    
    print()
    
    # Seasonal information
    if result['seasonal_info']:
        print(f"{bold}📅 SEASONAL FACTORS:{reset}")
        for info in result['seasonal_info']:
            print(f"   {info}")
        print(f"   Adjusted Risk Score: {result['adjusted_seasonal_score']:.2f}/10\n")
    
    # Risk breakdown
    print(f"{bold}📊 DISASTER TYPE RISKS:{reset}")
    breakdown = get_risk_breakdown(result['disaster_risks'])
    for risk_type, score in breakdown:
        bar = create_progress_bar(score)
        print(f"   {risk_type}: {bar}")
    
    # Historical score
    print(f"\n{bold}📈 HISTORICAL RISK ANALYSIS:{reset}")
    hist_bar = create_progress_bar(result['historical_score'])
    print(f"   Score: {hist_bar}")
    
    # Weather analysis
    if result['weather_data']:
        print(f"\n{bold}🌤️  CURRENT WEATHER CONDITIONS:{reset}")
        print(f"   🌡️  Temperature: {result['weather_data']['temperature']}°C")
        print(f"   💧 Humidity: {result['weather_data']['humidity']}%")
        print(f"   🌧️  Rainfall: {result['weather_data']['rainfall']} mm/hr")
        print(f"   💨 Wind Speed: {result['weather_data']['wind']} km/h")
        print(f"   ☁️  Condition: {result['weather_data']['weather']}")
        
        print(f"\n{bold}⚡ WEATHER RISK SCORE:{reset}")
        weather_bar = create_progress_bar(result['weather_score'])
        print(f"   {weather_bar}")
    
    # Neural Network Analysis
    print(f"\n{bold}🧠 NEURAL NETWORK ANALYSIS:{reset}")
    risk_levels = ["SAFE", "MODERATE RISK", "HIGH RISK"]
    nn_level = risk_levels[result['nn_risk_level']]
    confidence_color = "\033[92m" if result['nn_confidence'] >= 80 else "\033[93m" if result['nn_confidence'] >= 60 else "\033[91m"
    print(f"   Predicted Risk Level: {nn_level}")
    print(f"   Deep Learning Confidence: {confidence_color}{result['nn_confidence']:.1f}%{reset}")
    
    # Similar districts
    if result['similar_districts']:
        print(f"\n{bold}🔍 SIMILAR DISASTER PATTERNS (via Neural Clustering):{reset}")
        for i, (_, distance, district_name) in enumerate(result['similar_districts'], 1):
            print(f"   {i}. {district_name} (Pattern Distance: {distance:.2f})")
    
    # Final assessment
    print(f"\n{bold}{'─'*75}{reset}")
    final_bar = create_progress_bar(result['final_score'])
    print(f"{bold}🎯 FINAL RISK SCORE: {reset}{final_bar}")
    
    risk_color = get_risk_color(result['final_score'])
    print(f"{risk_color}{bold}⚠️  RISK LEVEL: {result['risk']}{reset}")
    
    # AI insights
    insights = get_ai_insights(result['disaster_risks'], result['historical_score'],
                               result['weather_score'], result['final_score'],
                               result['nn_confidence'])
    print(f"\n{bold}🤖 AI-POWERED INSIGHTS:{reset}")
    for insight in insights:
        print(f"   {insight}")
    
    print(f"\n{bold}{'─'*75}{reset}\n")


# ---------------------------
# RUN
# ---------------------------
if __name__ == "__main__":
    print("\n🧠 Advanced Disaster AI System - Training Neural Networks...")
    districts = load_districts()
    print("✅ Neural Network Training Complete")
    print("✅ Disaster Pattern Clustering Complete")
    print(f"🤖 Disaster AI System Ready - Loaded {len(districts)} districts with Deep Learning\n")
    
    print("📝 HOW TO USE:")
    print("   • Enter district name: 'Bengaluru Urban', 'Hassan', 'Kodagu', etc.")
    print("   • OR enter coordinates: '12.97,77.59' or '12.97 77.59'")
    print("   • Type 'exit' to quit\n")
    
    while True:
        user_input = input("Enter district name or coordinates (lat,lon): ").strip()
        if user_input.lower() == "exit":
            print("\n👋 Thank you for using AI Disaster Assessment!\n")
            break
        
        if not user_input:
            continue
        
        result = predict(user_input, districts)
        display_result(result)