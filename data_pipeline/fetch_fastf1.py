import fastf1
import psycopg2
import pandas as pd
import numpy as np

# Enable caching to speed up requests
fastf1.Cache.enable_cache('fastf1_cache')

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="f1_analytics",
        user="postgres",
        password="admin123"
    )

def setup_db():
    conn = get_db_connection()
    cur = conn.cursor()
    # Ensure columns exist
    cur.execute("""
        ALTER TABLE results 
        ADD COLUMN IF NOT EXISTS avg_lap_time FLOAT,
        ADD COLUMN IF NOT EXISTS lap_time_std_dev FLOAT,
        ADD COLUMN IF NOT EXISTS position_gain INT;
    """)
    conn.commit()
    cur.close()
    conn.close()

def get_or_create_driver(cur, driver_id_str, first_name, last_name, nationality=""):
    cur.execute("SELECT id FROM drivers WHERE driver_ref = %s", (driver_id_str,))
    res = cur.fetchone()
    if res:
        return res[0]
    
    cur.execute(
        "INSERT INTO drivers (driver_ref, first_name, last_name, nationality) VALUES (%s, %s, %s, %s) RETURNING id",
        (driver_id_str, first_name, last_name, nationality)
    )
    return cur.fetchone()[0]

def get_or_create_race(cur, race_name, race_date, season, circuit):
    cur.execute("SELECT id FROM races WHERE name = %s AND season = %s", (race_name, season))
    res = cur.fetchone()
    if res:
        return res[0]
    
    cur.execute(
        "INSERT INTO races (name, race_date, season, circuit) VALUES (%s, %s, %s, %s) RETURNING id",
        (race_name, race_date, season, circuit)
    )
    return cur.fetchone()[0]

def main():
    setup_db()
    conn = get_db_connection()
    cur = conn.cursor()
    
    season = 2023
    schedule = fastf1.get_event_schedule(season)
    
    # We only care about actual races, not testing
    races = schedule[schedule['EventFormat'] != 'testing']
    
    for _, event in races.iterrows():
        try:
            print(f"Loading {event['EventName']}...")
            session = fastf1.get_session(season, event['RoundNumber'], 'R')
            session.load(telemetry=False, weather=False)
            
            race_date = event['EventDate'].date()
            race_id = get_or_create_race(cur, event['EventName'], race_date, season, event['Location'])
            
            # Group laps by driver to calculate avg and std_dev
            laps = session.laps
            
            for _, result in session.results.iterrows():
                # Extract Driver info
                driver_ref = str(result['DriverId']).lower()
                first_name = str(result['FirstName'])
                last_name = str(result['LastName'])
                
                db_driver_id = get_or_create_driver(cur, driver_ref, first_name, last_name)
                
                # We mock constructor ID to a simple hash for now if there isn't a constructors table
                # Assuming results table takes integer constructor_id
                constructor_id = hash(result['TeamName']) % 10000
                
                grid = result['GridPosition']
                finish = result['Position']
                points = result['Points']
                
                # If finish or grid is NaN/0 due to DNF, handle it gracefully
                if pd.isna(grid) or grid == 0: grid = 20
                if pd.isna(finish) or finish == 0: finish = 20
                
                position_gain = int(grid) - int(finish)
                
                # Lap statistics
                driver_laps = laps.pick_driver(result['DriverNumber'])
                # Lap times in seconds
                lap_times = driver_laps['LapTime'].dt.total_seconds().dropna()
                
                avg_lap_time = lap_times.mean() if not lap_times.empty else None
                lap_time_std_dev = lap_times.std() if not lap_times.empty else None
                
                if pd.isna(avg_lap_time): avg_lap_time = None
                if pd.isna(lap_time_std_dev): lap_time_std_dev = None
                
                # Check if result already exists
                cur.execute("SELECT id FROM results WHERE driver_id = %s AND race_id = %s", (db_driver_id, race_id))
                exists = cur.fetchone()
                
                if exists:
                    cur.execute("""
                        UPDATE results SET
                            grid_position = %s,
                            finish_position = %s,
                            points = %s,
                            constructor_id = %s,
                            avg_lap_time = %s,
                            lap_time_std_dev = %s,
                            position_gain = %s,
                            status = %s
                        WHERE id = %s
                    """, (grid, finish, points, constructor_id, avg_lap_time, lap_time_std_dev, position_gain, result['Status'], exists[0]))
                else:
                    cur.execute("""
                        INSERT INTO results 
                        (driver_id, race_id, constructor_id, grid_position, finish_position, points, avg_lap_time, lap_time_std_dev, position_gain, status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (db_driver_id, race_id, constructor_id, grid, finish, points, avg_lap_time, lap_time_std_dev, position_gain, result['Status']))
            
            conn.commit()
            print(f"✅ Saved {event['EventName']}")
        except Exception as e:
            print(f"❌ Error loading {event['EventName']}: {e}")
            conn.rollback()

    cur.close()
    conn.close()
    print("FastF1 Data Pipeline Complete!")

if __name__ == "__main__":
    main()
