"""First-aid training locations, looked up through the Google Places API."""

import os

import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PLACES_TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
PLACES_QUERY = (
    "first aid training in Cluj-Napoca OR "
    "CPR training in Cluj-Napoca OR "
    "Crucea Rosie Cluj-Napoca OR "
    "Red Cross Cluj-Napoca OR "
    "first aid Cluj"
)
REQUEST_TIMEOUT_SECONDS = 10

router = APIRouter(prefix="/nearby", tags=["First Aid Centers"])


@router.get("/first-aid-centers")
def first_aid_centers(lat: float, lon: float, radius: int = 5000):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Missing GOOGLE_API_KEY environment variable")

    response = requests.get(
        PLACES_TEXT_SEARCH_URL,
        params={
            "query": PLACES_QUERY,
            "location": f"{lat},{lon}",
            "radius": radius,
            "region": "ro",
            "key": GOOGLE_API_KEY,
        },
        timeout=REQUEST_TIMEOUT_SECONDS,
    )

    places = [
        {
            "name": place.get("name"),
            "lat": place["geometry"]["location"]["lat"],
            "lon": place["geometry"]["location"]["lng"],
            "address": place.get("formatted_address", ""),
            "types": place.get("types", []),
            "icon": "red",
        }
        for place in response.json().get("results", [])
    ]

    return {"count": len(places), "places": places}
