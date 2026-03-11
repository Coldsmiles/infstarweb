import os
import json
import threading
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from tqdm import tqdm  # Add tqdm for progress bars

STATS_DIR = "stats"
MAX_WORKERS = max(4, min(16, int(os.environ.get("STATS_MAX_WORKERS", (os.cpu_count() or 4) * 2))))

# HTTP Basic Auth for BASE_URL (from environment variables)
BASE_URL = os.environ.get("STATS_BASE_URL", "")
STATS_USER = os.environ.get("STATS_USER", "")
STATS_PASS = os.environ.get("STATS_PASS", "")
BASE_AUTH = (STATS_USER, STATS_PASS) if STATS_USER else None

retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
)
thread_local = threading.local()


def create_session():
    session = requests.Session()
    session.trust_env = False  # Ignore HTTP_PROXY / HTTPS_PROXY env vars
    adapter = HTTPAdapter(
        max_retries=retry_strategy,
        pool_connections=MAX_WORKERS,
        pool_maxsize=MAX_WORKERS,
    )
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def get_session():
    session = getattr(thread_local, "session", None)
    if session is None:
        session = create_session()
        thread_local.session = session
    return session

if BASE_AUTH:
    print(f"Using authentication for BASE_URL (user: {STATS_USER})")
else:
    print("No STATS_USER/STATS_PASS set, accessing BASE_URL without auth.")

# Ensure directories exist
os.makedirs(STATS_DIR, exist_ok=True)

print("Fetching file list...")
fetch_failed = False
try:
    response = get_session().get(BASE_URL, timeout=10, auth=BASE_AUTH)
    response.raise_for_status()
    content = response.text
    # Regex for UUID.json
    files = sorted(set(re.findall(r'href="([0-9a-f-]{36}\.json)"', content)))
    print(f"Found {len(files)} player stats files.")
except Exception as e:
    print(f"Error fetching file list: {e}")
    files = []
    fetch_failed = True


def load_name_cache():
    summary_path = os.path.join(STATS_DIR, 'summary.json')
    if not os.path.exists(summary_path):
        return {}

    try:
        with open(summary_path, 'r', encoding='utf-8') as f:
            summary = json.load(f)
    except Exception:
        return {}

    return {
        player.get('uuid'): player.get('name')
        for player in summary.get('players', [])
        if player.get('uuid') and player.get('name') and player.get('name') != "Unknown"
    }


def get_player_name(uuid):
    # Try Ashcon first
    try:
        r = get_session().get(f"https://api.ashcon.app/mojang/v2/user/{uuid}", timeout=5)
        if r.status_code == 200:
            return r.json().get('username')
    except Exception:
        pass
    
    # Try Mojang Session
    try:
        r = get_session().get(f"https://sessionserver.mojang.com/session/minecraft/profile/{uuid}", timeout=5)
        if r.status_code == 200:
            return r.json().get('name')
    except Exception:
        pass
    
    return "Unknown"


def format_dist(cm):
    m = cm / 100
    if m < 1000:
        return f"{m:.1f} m"
    return f"{m / 1000:.2f} km"


def format_time(ticks):
    seconds = ticks / 20
    if seconds < 60:
        return f"{seconds:.3f} 秒"
    minutes = seconds / 60
    if minutes < 60:
        return f"{minutes:.3f} 分钟"
    hours = minutes / 60
    if hours < 24:
        return f"{hours:.3f} 小时"
    days = hours / 24
    return f"{days:.3f} 天"


def process_player(filename, name_cache):
    uuid = filename.replace(".json", "")
    json_path = os.path.join(STATS_DIR, filename)
    
    # 1. Download/Load JSON
    data = None
    try:
        r = get_session().get(BASE_URL + filename, timeout=10, auth=BASE_AUTH)
        if r.status_code == 200:
            data = r.json()
        else:
            print(f"Failed to download {filename}")
            return None
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
        return None

    if not data:
        return None

    # 2. Get Name
    player_name = name_cache.get(uuid, "Unknown")

    if player_name == "Unknown":
        player_name = get_player_name(uuid)

    # 3. Download Avatar - SKIPPED to avoid rate limits
    # The frontend will handle dynamic loading of avatars using Minotar/Crafatar URLs.

    # 4. Calculate Stats
    stats = data.get('stats', {})
    
    # Walk
    # Handle both modern ':' and potentially flattened or different versions if necessary, 
    # but usually proper JSON has "minecraft:custom"
    # "minecraft:walk_one_cm"

    custom = stats.get('minecraft:custom', {})
    walk_cm = custom.get('minecraft:walk_one_cm', 0)

    walk_fmt = format_dist(walk_cm)

    # Play Time (1 tick = 1/20 second)
    play_time_ticks = custom.get('minecraft:play_time', 0)

    play_time_fmt = format_time(play_time_ticks)

    # Mined
    mined = stats.get('minecraft:mined', {})
    total_mined = sum(mined.values())

    # Placed (Used)
    used = stats.get('minecraft:used', {})
    total_placed = sum(used.values())

    # Deaths (Killed By)
    killed_by = stats.get('minecraft:killed_by', {})
    total_deaths = sum(killed_by.values())

    # Kills (Killed)
    killed = stats.get('minecraft:killed', {})
    total_kills = sum(killed.values())

    # Inject into JSON
    data['extra'] = {
        'player_name': player_name,
        'formatted_walk': walk_fmt,
        'walk_cm': walk_cm,
        'total_mined': total_mined,
        'total_placed': total_placed,
        'total_deaths': total_deaths,
        'total_kills': total_kills,
        'play_time_fmt': play_time_fmt,
        'play_time_ticks': play_time_ticks
    }

    # Save
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return {
        'uuid': uuid,
        'name': player_name,
        'avatar': f"https://minotar.net/avatar/{player_name}/64" if player_name != "Unknown" else f"https://minotar.net/avatar/{uuid}/64",
        'stats': {
            'walk_fmt': walk_fmt,
            'walk_raw': walk_cm,
            'mined': total_mined,
            'placed': total_placed,
            'deaths': total_deaths,
            'kills': total_kills,
            'play_time_fmt': play_time_fmt,
            'play_time_raw': play_time_ticks
        }
    }


name_cache = load_name_cache()

results = []
if files:
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_map = {
            executor.submit(process_player, filename, name_cache): filename
            for filename in files
        }
        for future in tqdm(as_completed(future_map), total=len(future_map), desc="Processing players"):
            try:
                result = future.result()
            except Exception as e:
                print(f"Worker failed for {future_map[future]}: {e}")
                continue
            if result is not None:
                results.append(result)

if fetch_failed:
    print("Skipping summary update because file list fetch failed.")
    raise SystemExit(1)

# Sort by name perhaps? Or just raw list.
results.sort(key=lambda x: x['name'])

summary = {
    'updated_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    'players': results
}

with open(os.path.join(STATS_DIR, 'summary.json'), 'w', encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=4)

print("Processing complete. Summary saved to stats/summary.json")
