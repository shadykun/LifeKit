from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.media import Video as VideoModel
from schemas import Video, VideoCreate

router = APIRouter(prefix="/videos", tags=["Videos"])


@router.get("/", response_model=list[Video])
def get_videos(db: Session = Depends(get_db)):
    return db.query(VideoModel).all()


@router.get("/{video_id}", response_model=Video)
def get_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(VideoModel).filter_by(id=video_id).first()
    if not video:
        raise HTTPException(404, "Video not found")
    return video


@router.post("/", response_model=Video)
def create_video(data: VideoCreate, db: Session = Depends(get_db)):
    video = VideoModel(**data.dict())
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


@router.put("/{video_id}", response_model=Video)
def update_video(video_id: int, data: VideoCreate, db: Session = Depends(get_db)):
    video = db.query(VideoModel).filter_by(id=video_id).first()
    if not video:
        raise HTTPException(404, "Video not found")
    for k, v in data.dict().items():
        setattr(video, k, v)
    db.commit()
    return video


@router.delete("/{video_id}")
def delete_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(VideoModel).filter_by(id=video_id).first()
    if not video:
        raise HTTPException(404, "Video not found")
    db.delete(video)
    db.commit()
    return {"message": "Video deleted"}
