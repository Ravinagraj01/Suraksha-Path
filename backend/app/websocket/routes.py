from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import ws_manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/sos-feed")
async def sos_feed(websocket: WebSocket):
    await ws_manager.connect("sos-feed", websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect("sos-feed", websocket)


@router.websocket("/ws/shelter-updates")
async def shelter_updates(websocket: WebSocket):
    await ws_manager.connect("shelter-updates", websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect("shelter-updates", websocket)
