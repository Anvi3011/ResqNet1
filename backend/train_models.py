"""Train ML models for Mumbai and risk-prone cities"""
import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

from nasa_power_client import train_city_models_advanced

CITIES_TO_TRAIN = {
    "Mumbai": {"lat": 19.0760, "lon": 72.8777},
    "Dhaka": {"lat": 23.8103, "lon": 90.4125},       # Bangladesh - extreme flood risk
    "Manila": {"lat": 14.5995, "lon": 120.9842},      # Philippines - typhoon hotspot
}

if __name__ == "__main__":
    os.makedirs('trained_models', exist_ok=True)
    
    for city, coords in CITIES_TO_TRAIN.items():
        print(f"\n{'='*60}")
        print(f"TRAINING: {city}")
        print(f"{'='*60}")
        try:
            trainer = train_city_models_advanced(city, coords['lat'], coords['lon'], years=15)
            if trainer:
                print(f"SUCCESS: {city} models trained!")
            else:
                print(f"FAILED: {city}")
        except Exception as e:
            print(f"ERROR training {city}: {e}")
    
    print("\n\nALL TRAINING COMPLETE!")
