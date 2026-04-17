from app.db import fetch_data
import pandas as pd

# =========================================
# TRAINING DATA (USED FOR MODEL TRAINING)
# =========================================
def load_training_data():
    query = """
    SELECT 
        r.driver_id,
        r.constructor_id,
        r.race_id,
        r.grid_position,
        r.finish_position,
        r.points,
        r.avg_lap_time,
        r.lap_time_std_dev,
        r.position_gain,
        ra.race_date
    FROM results r
    JOIN races ra ON r.race_id = ra.id
    ORDER BY ra.race_date, r.constructor_id, r.driver_id
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

    df['avg_lap_time_last_5'] = (
        df.groupby('driver_id')['avg_lap_time']
        .rolling(5, min_periods=1)
        .mean()
        .shift(1)
        .reset_index(level=0, drop=True)
    )

    df['win'] = (df['finish_position'] == 1).astype(int)
    df['total_wins'] = df.groupby('driver_id')['win'].cumsum().shift(1)

    df['podium'] = (df['finish_position'] <= 3).astype(int)
    df['total_podiums'] = df.groupby('driver_id')['podium'].cumsum().shift(1)

    # Constructor Performance
    constructor_race = (
        df.groupby(['constructor_id', 'race_id', 'race_date'])['points']
        .sum()
        .reset_index()
        .sort_values(['constructor_id', 'race_date'])
    )

    constructor_race['constructor_points_last_5'] = (
        constructor_race.groupby('constructor_id')['points']
        .rolling(5, min_periods=1)
        .mean()
        .shift(1)
        .reset_index(level=0, drop=True)
    )

    df = df.merge(
        constructor_race[['constructor_id', 'race_id', 'constructor_points_last_5']],
        on=['constructor_id', 'race_id'],
        how='left'
    )

    # Fill NaNs for the new columns
    df.fillna({'avg_lap_time_last_5': 0, 'lap_time_std_dev': 0, 'position_gain': 0, 'constructor_points_last_5': 0}, inplace=True)

    return df


# =========================================
# PREDICTION FEATURE BUILDER
# =========================================
def build_features_for_prediction(driver_id, race_id):

    # STEP 1 — get race date + constructor
    race_query = f"""
    SELECT r.race_date, res.constructor_id
    FROM races r
    JOIN results res ON r.id = res.race_id
    WHERE r.id = {race_id} AND res.driver_id = {driver_id}
    LIMIT 1
    """
    race_df = fetch_data(race_query)

    if race_df.empty:
        return None

    race_date = race_df.iloc[0]["race_date"]
    constructor_id = race_df.iloc[0]["constructor_id"]

    # STEP 2 — driver past data
    driver_query = f"""
    SELECT 
        r.driver_id,
        r.grid_position,
        r.finish_position,
        r.points,
        r.avg_lap_time,
        r.lap_time_std_dev,
        r.position_gain,
        ra.race_date
    FROM results r
    JOIN races ra ON r.race_id = ra.id
    WHERE r.driver_id = {driver_id}
      AND ra.race_date < '{race_date}'
    ORDER BY ra.race_date
    """

    df = fetch_data(driver_query)

    if df.empty:
        return None

    # STEP 3 — driver features
    df['avg_finish_last_5'] = df['finish_position'].rolling(5, min_periods=1).mean()
    df['avg_points_last_5'] = df['points'].rolling(5, min_periods=1).mean()
    df['avg_lap_time_last_5'] = df['avg_lap_time'].rolling(5, min_periods=1).mean()

    df['win'] = (df['finish_position'] == 1).astype(int)
    df['total_wins'] = df['win'].cumsum()

    df['podium'] = (df['finish_position'] <= 3).astype(int)
    df['total_podiums'] = df['podium'].cumsum()

    # Team performance
    constructor_query = f"""
    SELECT 
        r.race_id,
        SUM(r.points) as team_points,
        ra.race_date
    FROM results r
    JOIN races ra ON r.race_id = ra.id
    WHERE r.constructor_id = {constructor_id}
      AND ra.race_date < '{race_date}'
    GROUP BY r.race_id, ra.race_date
    ORDER BY ra.race_date
    """

    cdf = fetch_data(constructor_query)

    if cdf.empty:
        constructor_perf = 0
    else:
        cdf['constructor_points_last_5'] = (
            cdf['team_points']
            .rolling(5, min_periods=1)
            .mean()
        )
        constructor_perf = cdf.iloc[-1]['constructor_points_last_5']

    # STEP 4 — latest driver row
    latest = df.iloc[-1]

    return {
        "grid_position": int(latest["grid_position"]),
        "avg_finish_last_5": float(latest["avg_finish_last_5"]) if not pd.isna(latest["avg_finish_last_5"]) else 0.0,
        "avg_points_last_5": float(latest["avg_points_last_5"]) if not pd.isna(latest["avg_points_last_5"]) else 0.0,
        "avg_lap_time_last_5": float(latest["avg_lap_time_last_5"]) if not pd.isna(latest["avg_lap_time_last_5"]) else 0.0,
        "lap_time_std_dev": float(latest["lap_time_std_dev"]) if not pd.isna(latest["lap_time_std_dev"]) else 0.0,
        "position_gain": int(latest["position_gain"]) if not pd.isna(latest["position_gain"]) else 0,
        "total_wins": int(latest["total_wins"]),
        "total_podiums": int(latest["total_podiums"]),
        "constructor_points_last_5": float(constructor_perf) if not pd.isna(constructor_perf) else 0.0
    }