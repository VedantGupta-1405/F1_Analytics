from app.db import fetch_data
import pandas as pd

# =========================================
# TRAINING DATA (USED FOR MODEL TRAINING)
# =========================================
def load_training_data():
    query = """
    SELECT 
        r.driver_id,
        r.race_id,
        r.grid_position,
        r.finish_position,
        r.points,
        ra.race_date
    FROM results r
    JOIN races ra ON r.race_id = ra.id
    ORDER BY r.driver_id, ra.race_date
    """

    df = fetch_data(query)

    df['target'] = df['finish_position'].apply(lambda x: 1 if x <= 3 else 0)

    df['avg_finish_last_5'] = (
        df.groupby('driver_id')['finish_position']
        .rolling(5, min_periods=1)
        .mean()
        .shift(1)
        .reset_index(level=0, drop=True)
    )

    df['avg_points_last_5'] = (
        df.groupby('driver_id')['points']
        .rolling(5, min_periods=1)
        .mean()
        .shift(1)
        .reset_index(level=0, drop=True)
    )

    df['win'] = (df['finish_position'] == 1).astype(int)
    df['total_wins'] = df.groupby('driver_id')['win'].cumsum().shift(1)

    df['podium'] = (df['finish_position'] <= 3).astype(int)
    df['total_podiums'] = df.groupby('driver_id')['podium'].cumsum().shift(1)

    df.fillna(0, inplace=True)

    return df


# =========================================
# PREDICTION FEATURE BUILDER (FIXED)
# =========================================
def build_features_for_prediction(driver_id, race_id):

    # STEP 1 — get race date
    race_query = f"""
    SELECT race_date FROM races WHERE id = {race_id}
    """
    race_df = fetch_data(race_query)

    if race_df.empty:
        return None

    race_date = race_df.iloc[0]["race_date"]

    # STEP 2 — get ONLY past data
    query = f"""
    SELECT 
        r.driver_id,
        r.grid_position,
        r.finish_position,
        r.points,
        ra.race_date
    FROM results r
    JOIN races ra ON r.race_id = ra.id
    WHERE r.driver_id = {driver_id}
      AND ra.race_date < '{race_date}'
    ORDER BY ra.race_date
    """

    df = fetch_data(query)

    if df.empty:
        return None

    # STEP 3 — feature engineering
    df['avg_finish_last_5'] = (
        df['finish_position']
        .rolling(5, min_periods=1)
        .mean()
    )

    df['avg_points_last_5'] = (
        df['points']
        .rolling(5, min_periods=1)
        .mean()
    )

    df['win'] = (df['finish_position'] == 1).astype(int)
    df['total_wins'] = df['win'].cumsum()

    df['podium'] = (df['finish_position'] <= 3).astype(int)
    df['total_podiums'] = df['podium'].cumsum()

    # STEP 4 — latest row
    latest = df.iloc[-1]

    return {
        "grid_position": int(latest["grid_position"]),
        "avg_finish_last_5": float(latest["avg_finish_last_5"]),
        "avg_points_last_5": float(latest["avg_points_last_5"]),
        "total_wins": int(latest["total_wins"]),
        "total_podiums": int(latest["total_podiums"])
    }