from __future__ import annotations
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status

from app.core.config import get_settings

settings = get_settings()


class InMemoryRateLimiter:
    def __init__(self) -> None:
        self._store: dict[str, deque] = defaultdict(deque)

    def hit(self, key: str, per_minute: Optional[int] = None) -> None:
        threshold = per_minute or settings.RATE_LIMIT_SOS_PER_MINUTE
        now = datetime.now(timezone.utc)
        window = now - timedelta(minutes=1)

        bucket = self._store[key]
        while bucket and bucket[0] < window:
            bucket.popleft()
        if len(bucket) >= threshold:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many SOS requests")
        bucket.append(now)


sos_limiter = InMemoryRateLimiter()
