from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Checkin
from app.schemas import Checkin as CheckinSchema, CheckinCreate
from app.api.dependencies import get_current_user
from app.services import reverse_geocode

router = APIRouter(prefix="/api/checkins", tags=["checkins"])


@router.post("", response_model=CheckinSchema, status_code=status.HTTP_201_CREATED)
async def create_checkin(
    checkin: CheckinCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 逆ジオコーディングで住所を取得
    address_info = await reverse_geocode(checkin.latitude, checkin.longitude)

    # チェックインを作成
    db_checkin = Checkin(
        user_id=current_user.id,
        latitude=checkin.latitude,
        longitude=checkin.longitude,
        prefecture=address_info["prefecture"],
        city=address_info["city"],
        address_detail=address_info["address_detail"],
        checked_at=checkin.checked_at
    )

    db.add(db_checkin)
    db.commit()
    db.refresh(db_checkin)

    return db_checkin


@router.get("", response_model=List[CheckinSchema])
def get_checkins(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    checkins = db.query(Checkin)\
        .filter(Checkin.user_id == current_user.id)\
        .order_by(Checkin.checked_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

    return checkins


@router.get("/{checkin_id}", response_model=CheckinSchema)
def get_checkin(
    checkin_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    checkin = db.query(Checkin)\
        .filter(Checkin.id == checkin_id, Checkin.user_id == current_user.id)\
        .first()

    if not checkin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checkin not found"
        )

    return checkin


@router.delete("/{checkin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_checkin(
    checkin_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    checkin = db.query(Checkin)\
        .filter(Checkin.id == checkin_id, Checkin.user_id == current_user.id)\
        .first()

    if not checkin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checkin not found"
        )

    db.delete(checkin)
    db.commit()

    return None
