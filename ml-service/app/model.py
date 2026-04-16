from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
from app.preprocess import load_training_data

def train_model():
    df = load_training_data()

    # =========================
    # FEATURES (UPDATED)
    # =========================
    features = [
        'grid_position',
        'avg_finish_last_5',
        'avg_points_last_5',
        'total_wins',
        'total_podiums',
        'constructor_points_last_5'  # ✅ ADDED
    ]

    X = df[features]
    y = df['target']

    # IMPORTANT: no shuffle (time-based data)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    # =========================
    # MODEL
    # =========================
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # =========================
    # EVALUATION
    # =========================
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    # =========================
    # SAVE MODEL
    # =========================
    joblib.dump(model, "saved_models/model.pkl")

    return f"Model trained with accuracy: {acc:.4f}"