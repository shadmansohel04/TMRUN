import random
from datetime import datetime, timedelta
import json

def generate_random_activity(base_activity, activity_id):
    # Create a copy of the base activity to modify
    new_activity = base_activity.copy()

    # Generate random values for the fields
    new_activity['id'] = activity_id
    new_activity['name'] = f"Run #{activity_id}"
    new_activity['distance'] = round(random.uniform(2000, 20000), 1)  # Distance in meters
    new_activity['moving_time'] = random.randint(1500, 3000)  # Moving time in seconds
    new_activity['elapsed_time'] = new_activity['moving_time'] + random.randint(0, 1000)  # Elapsed time
    new_activity['total_elevation_gain'] = round(random.uniform(10, 100), 1)  # Elevation gain in meters
    new_activity['average_speed'] = round(new_activity['distance'] / new_activity['moving_time'], 3)
    new_activity['max_speed'] = round(new_activity['average_speed'] * random.uniform(1.2, 1.6), 3)
    new_activity['start_date'] = (datetime.utcnow() - timedelta(days=random.randint(0, 365))).isoformat() + "Z"
    new_activity['start_date_local'] = (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat()
    new_activity['start_latlng'] = [round(random.uniform(43.5, 45.0), 6), round(random.uniform(-80.0, -79.0), 6)]
    new_activity['end_latlng'] = [round(random.uniform(43.5, 45.0), 6), round(random.uniform(-80.0, -79.0), 6)]
    new_activity['elev_high'] = round(random.uniform(200, 300), 1)
    new_activity['elev_low'] = round(new_activity['elev_high'] - random.uniform(10, 50), 1)

    return new_activity

# Base activity data
base_activity = {
    "resource_state": 2,
    "athlete": {
        "id": 138431042,
        "resource_state": 1
    },
    "name": "Evening Run",
    "distance": 5251.9,
    "moving_time": 1743,
    "elapsed_time": 2323,
    "total_elevation_gain": 53.4,
    "type": "Run",
    "sport_type": "Run",
    "workout_type": 0,
    "id": 11939415501.0,
    "start_date": "2024-07-20T23:17:17Z",
    "start_date_local": "2024-07-20T19:17:17Z",
    "timezone": "(GMT-05:00) America/Toronto",
    "utc_offset": -14400,
    "location_city": None,
    "location_state": None,
    "location_country": "Canada",
    "achievement_count": 0,
    "kudos_count": 0,
    "comment_count": 0,
    "athlete_count": 1,
    "photo_count": 0,
    "trainer": False,
    "commute": False,
    "manual": False,
    "private": False,
    "visibility": "everyone",
    "flagged": False,
    "gear_id": None,
    "start_latlng": [44.080187883228064, -79.45534452795982],
    "end_latlng": [44.10169861279428, -79.45558642968535],
    "average_speed": 3.013,
    "max_speed": 4.458,
    "has_heartrate": False,
    "heartrate_opt_out": False,
    "display_hide_heartrate_option": False,
    "elev_high": 256.3,
    "elev_low": 230.3,
    "upload_id": 12730154156.0,
    "upload_id_str": "12730154156",
    "external_id": "C1920548-B058-4593-BE85-849D50F091E3-activity.fit",
    "from_accepted_tag": False,
    "pr_count": 0,
    "total_photo_count": 0,
    "has_kudoed": False
}

# Generate 8 random activities
activities = [generate_random_activity(base_activity, 11939415501 + i) for i in range(5)]

with open("final.json", "r") as file:
    data = json.load(file)

for activity in activities:
    data["recentRuns"].append(activity)

with open("final.json", "w") as newfi:
    json.dump(data, newfi, indent=2)
