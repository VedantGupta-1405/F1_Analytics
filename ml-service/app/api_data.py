from fastapi import APIRouter
import requests
import json
import os
import xml.etree.ElementTree as ET

router = APIRouter()

_mem_cache = {}

@router.get("/api/season/{year}")
def get_season_data(year: int):
    # Fast memory cache
    if year in _mem_cache:
        return _mem_cache[year]
        
    # Local file cache
    cache_file = f"season_{year}_cache.json"
    if os.path.exists(cache_file):
        with open(cache_file, "r") as f:
            data = json.load(f)
            _mem_cache[year] = data
            return data

    try:
        # FastF1's get_session().load() takes 3-5 minutes for a full calendar.
        # To prevent the UI from getting stuck, we use the ultra-fast Jolpi Ergast API 
        # which returns the EXACT same classification/points data in 1 second.
        res = requests.get(f"https://api.jolpi.ca/ergast/f1/{year}/results.json?limit=1000", timeout=10)
        data = res.json()
        races = data['MRData']['RaceTable']['Races']
        
        races_data = []
        for r in races:
            results = []
            for res_item in r.get('Results', []):
                results.append({
                    "driver_id": res_item['Driver']['driverId'],
                    "driver": f"{res_item['Driver']['givenName']} {res_item['Driver']['familyName']}",
                    "team": res_item['Constructor']['name'],
                    "team_id": res_item['Constructor']['constructorId'],
                    "grid_position": int(res_item['grid']),
                    "finish_position": int(res_item['position']) if res_item['position'].isdigit() else 99,
                    "points": float(res_item['points']),
                    "status": res_item['status']
                })
            races_data.append({
                "race_name": r['raceName'],
                "round": int(r['round']),
                "date": r['date'],
                "circuit_name": r['Circuit']['circuitName'],
                "country": r['Circuit']['Location']['country'],
                "results": results
            })
            
        result = {"year": year, "races": races_data}
        
        # Save to cache
        _mem_cache[year] = result
        with open(cache_file, "w") as f:
            json.dump(result, f)
            
        return result
        
    except Exception as e:
        print("API Error:", str(e))
        return {"error": "Failed to fetch data", "details": str(e)}

@router.get("/api/search")
def search(q: str, year: int = 2024):
    q = q.lower()
    season_data = get_season_data(year)
    if "error" in season_data: return []
    
    drivers_seen = set()
    races_seen = set()
    results = []
    
    for race in season_data.get('races', []):
        if q in race['race_name'].lower() and race['race_name'] not in races_seen:
            results.append({"type": "race", "id": race['round'], "name": race['race_name']})
            races_seen.add(race['race_name'])
            
        for res in race.get('results', []):
            if q in res['driver'].lower() and res['driver_id'] not in drivers_seen:
                results.append({"type": "driver", "id": res['driver_id'], "name": res['driver']})
                drivers_seen.add(res['driver_id'])
                
            if len(results) >= 10:
                break
        if len(results) >= 10:
            break
            
    return results

@router.get("/api/news")
def get_news():
    fallbacks = [
        "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1541446071853-271d4ce8c772?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&q=80&w=800"
    ]
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        r = requests.get("https://www.autosport.com/rss/feed/f1", headers=headers, timeout=10)
        root = ET.fromstring(r.content)
        items = root.findall('.//item')
        
        news = []
        for i, item in enumerate(items[:12]):
            title = item.find('title').text if item.find('title') is not None else "F1 News Update"
            link = item.find('link').text if item.find('link') is not None else "#"
            date = item.find('pubDate').text if item.find('pubDate') is not None else "Today"
            
            image_url = fallbacks[i % len(fallbacks)]
            enclosure = item.find('enclosure')
            if enclosure is not None and enclosure.get('url'):
                image_url = enclosure.get('url')
            else:
                # Autosport sometimes uses media:content, we can try to find an image tag inside description
                desc = item.find('description')
                if desc is not None and desc.text and '<img src="' in desc.text:
                    start = desc.text.find('<img src="') + 10
                    end = desc.text.find('"', start)
                    image_url = desc.text[start:end]
            
            news.append({
                "title": title,
                "link": link,
                "date": date,
                "source": "Autosport F1",
                "image": image_url
            })
        return news
    except Exception as e:
        print("News error:", e)
        return [
            {"title": "Latest technical developments in the paddock", "date": "Today", "source": "F1 News", "link": "#", "image": fallbacks[0]},
            {"title": "Driver market heats up as contracts expire", "date": "Yesterday", "source": "F1 Insider", "link": "#", "image": fallbacks[1]}
        ]
