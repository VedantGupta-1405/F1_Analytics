from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report  # ✅ ADDED
import joblib
from app.preprocess import load_training_data

def train_model():
    df = load_training_data()

    # =========================
    # FEATURES
    # =========================
    features = [
        'grid_position',
        'avg_finish_last_5',
        'avg_points_last_5',
        'total_wins',
        'total_podiums',
        'constructor_points_last_5'
    ]

    X = df[features]
    y = df['target']

    # =========================
    # TRAIN TEST SPLIT (TIME SAFE)
    # =========================
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    # =========================
    # 🔥 MODEL 1 — RANDOM FOREST (IMPROVED)
    # =========================
    rf_model = RandomForestClassifier(
        n_estimators=200,          # more trees
        max_depth=10,              # control overfitting
        class_weight="balanced",   # 🔥 handle imbalance
        random_state=42
    )
    rf_model.fit(X_train, y_train)

    rf_pred = rf_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_pred)

    # =========================
    # 🔥 MODEL 2 — LOGISTIC REGRESSION (IMPROVED)
    # =========================
    lr_model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced"    # 🔥 VERY IMPORTANT
    )
    lr_model.fit(X_train, y_train)

    lr_pred = lr_model.predict(X_test)
    lr_acc = accuracy_score(y_test, lr_pred)

    # =========================
    # 🔥 DEBUG (OPTIONAL BUT GOOD)
    # =========================
    rf_report = classification_report(y_test, rf_pred, output_dict=False)
    lr_report = classification_report(y_test, lr_pred, output_dict=False)

    # =========================
    # SELECT BEST MODEL
    # =========================
    if rf_acc >= lr_acc:
        best_model = rf_model
        best_name = "RandomForest"
        best_acc = rf_acc
        best_report = rf_report
    else:
        best_model = lr_model
        best_name = "LogisticRegression"
        best_acc = lr_acc
        best_report = lr_report

    # =========================
    # SAVE BEST MODEL
    # =========================
    joblib.dump(best_model, "saved_models/model.pkl")

    # =========================
    # RETURN RESULTS
    # =========================
    return (
        f"RF Accuracy: {rf_acc:.4f} | "
        f"LR Accuracy: {lr_acc:.4f} | "
        f"Best: {best_name} ({best_acc:.4f})\n\n"
        f"--- RF Report ---\n{rf_report}\n\n"
        f"--- LR Report ---\n{lr_report}"
    )