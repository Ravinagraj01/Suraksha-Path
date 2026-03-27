from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import httpx


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _risk_from_text(text: str) -> str:
    val = text.lower()
    if any(k in val for k in ["cyclone", "flash flood", "severe", "landslide", "earthquake"]):
        return "high"
    if any(k in val for k in ["flood", "storm", "fire", "heavy rain"]):
        return "medium"
    return "low"


def _ai_note(title: str, source: str) -> str:
    risk = _risk_from_text(title)
    return f"AI signal: {risk.upper()} priority update from {source}. Validate district preparedness and shelter readiness."


async def fetch_reliefweb(limit: int = 8) -> list[dict[str, Any]]:
    url = "https://api.reliefweb.int/v2/reports?appname=suraksha-path"
    payload = {
        "limit": limit,
        "sort": ["date.created:desc"],
        "filter": {
            "operator": "AND",
            "conditions": [
                {"field": "country", "value": ["India"], "operator": "OR"},
                {"field": "status", "value": ["published"], "operator": "OR"},
            ],
        },
        "fields": {"include": ["title", "url_alias", "date.created", "source.name", "country.name", "theme.name"]},
    }
    async with httpx.AsyncClient(timeout=12.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json().get("data", [])

    items = []
    for row in data:
        fields = row.get("fields", {})
        title = fields.get("title", "Untitled report")
        items.append(
            {
                "id": f"rw-{row.get('id')}",
                "title": title,
                "source": "ReliefWeb",
                "published_at": fields.get("date", {}).get("created") or _iso_now(),
                "url": fields.get("url_alias") or "https://reliefweb.int",
                "risk_level": _risk_from_text(title),
                "ai_summary": _ai_note(title, "ReliefWeb"),
                "location": "India",
            }
        )
    return items


async def fetch_eonet(limit: int = 8) -> list[dict[str, Any]]:
    url = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=40"
    async with httpx.AsyncClient(timeout=12.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        events = response.json().get("events", [])

    items = []
    for event in events:
        title = event.get("title", "Natural event")
        # EONET does not have robust country tags for every event; keep India keyword relevance.
        if "india" not in title.lower() and "bay of bengal" not in title.lower():
            continue
        links = event.get("sources", [])
        first_link = links[0]["url"] if links else "https://eonet.gsfc.nasa.gov/"
        geometry = event.get("geometry", [])
        published_at = geometry[-1].get("date") if geometry else _iso_now()
        items.append(
            {
                "id": f"eonet-{event.get('id')}",
                "title": title,
                "source": "NASA EONET",
                "published_at": published_at,
                "url": first_link,
                "risk_level": _risk_from_text(title),
                "ai_summary": _ai_note(title, "NASA EONET"),
                "location": "India region",
            }
        )
        if len(items) >= limit:
            break
    return items


async def get_ai_disaster_news(limit: int = 12) -> dict[str, Any]:
    items: list[dict[str, Any]] = []
    errors: list[str] = []

    try:
        items.extend(await fetch_reliefweb(limit=limit))
    except Exception as exc:  # pragma: no cover - network failure fallback
        errors.append(f"reliefweb: {exc}")

    try:
        items.extend(await fetch_eonet(limit=limit))
    except Exception as exc:  # pragma: no cover - network failure fallback
        errors.append(f"eonet: {exc}")

    items = sorted(items, key=lambda x: x.get("published_at", ""), reverse=True)[:limit]
    if not items:
        items = [
            {
                "id": "fallback-1",
                "title": "No live feeds currently reachable. Showing fallback disaster advisory.",
                "source": "SurakshaPath Fallback",
                "published_at": _iso_now(),
                "url": "",
                "risk_level": "medium",
                "ai_summary": "AI signal: MEDIUM priority. Check network/API status and continue local monitoring.",
                "location": "India",
            }
        ]

    return {
        "generated_at": _iso_now(),
        "count": len(items),
        "providers": ["ReliefWeb", "NASA EONET"],
        "errors": errors,
        "items": items,
    }
