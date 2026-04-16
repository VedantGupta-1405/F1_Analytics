from fastapi import FastAPI
import joblib
import pandas as pd
from app.model import train_model
from app.preprocess import build_features_for_prediction

app = FastAPI()

# =========================
# HEALTH CHECK
# =========================
@app.get("/")
def home():
    return {"message": "ML Service Running"}


# =========================
# TRAIN MODEL
# =========================
@app.post("/train-model")
def train():
    return {"status": train_model()}


# =========================
# PREDICT USING DRIVER + RACE
# =========================
@app.post("/predict")
def predict(driver_id: int, race_id: int):
    model = joblib.load("saved_models/model.pkl")

    # Build features from DB
    features = build_features_for_prediction(driver_id, race_id)

    if features is None:
        return {"error": "No data found for driver"}

    df = pd.DataFrame([features])

    pred = model.predict(df)[0]

    return {
        "prediction": int(pred),
        "features_used": features
    }