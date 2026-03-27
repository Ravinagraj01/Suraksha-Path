from fastapi import APIRouter

from app.services.news_service import get_ai_disaster_news

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/ai-disaster-updates")
async def ai_disaster_updates(limit: int = 12):
    return await get_ai_disaster_news(limit=max(1, min(limit, 30)))
