from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CheckinBase(BaseModel):
    latitude: float
    longitude: float


class CheckinCreate(CheckinBase):
    checked_at: datetime


class Checkin(CheckinBase):
    id: int
    user_id: int
    prefecture: Optional[str] = None
    city: Optional[str] = None
    address_detail: Optional[str] = None
    checked_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class CheckinWithUser(Checkin):
    username: str
