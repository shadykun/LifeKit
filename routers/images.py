from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.media import Image as ImageModel
from schemas import Image, ImageCreate

router = APIRouter(prefix="/images", tags=["Images"])


@router.get("/", response_model=list[Image])
def get_images(db: Session = Depends(get_db)):
    return db.query(ImageModel).all()


@router.get("/{image_id}", response_model=Image)
def get_image(image_id: int, db: Session = Depends(get_db)):
    image = db.query(ImageModel).filter_by(id=image_id).first()
    if not image:
        raise HTTPException(404, "Image not found")
    return image


@router.post("/", response_model=Image)
def create_image(data: ImageCreate, db: Session = Depends(get_db)):
    image = ImageModel(**data.dict())
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@router.put("/{image_id}", response_model=Image)
def update_image(image_id: int, data: ImageCreate, db: Session = Depends(get_db)):
    image = db.query(ImageModel).filter_by(id=image_id).first()
    if not image:
        raise HTTPException(404, "Image not found")
    for k, v in data.dict().items():
        setattr(image, k, v)
    db.commit()
    return image


@router.delete("/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db)):
    image = db.query(ImageModel).filter_by(id=image_id).first()
    if not image:
        raise HTTPException(404, "Image not found")
    db.delete(image)
    db.commit()
    return {"message": "Image deleted"}
