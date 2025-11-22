from fastapi import APIRouter, HTTPException
import requests
from dotenv import load_dotenv
import os


load_dotenv()
router = APIRouter(prefix="/nearby", tags=["First Aid Centers"])

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


@router.get("/first-aid-centers")
def first_aid_centers(lat: float, lon: float, radius: int = 5000):

    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Missing GOOGLE_API_KEY environment variable")

    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    query = (
        "first aid training in Cluj-Napoca OR "
        "CPR training in Cluj-Napoca OR "
        "Crucea Rosie Cluj-Napoca OR "
        "Red Cross Cluj-Napoca OR "
        "first aid Cluj"
    )

    params = {
        "query": query,
        "location": f"{lat},{lon}",
        "radius": radius,
        "region": "ro",
        "key": GOOGLE_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    results = []

    for place in data.get("results", []):
        results.append({
            "name": place.get("name"),
            "lat": place["geometry"]["location"]["lat"],
            "lon": place["geometry"]["location"]["lng"],
            "address": place.get("formatted_address", ""),
            "types": place.get("types", []),
            "icon": "red"
        })

    return {
        "count": len(results),
        "places": results
    }
