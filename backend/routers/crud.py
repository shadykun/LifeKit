"""Factory for the plain CRUD routers shared by every content resource."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import Base, get_db


def build_crud_router(
    *,
    prefix: str,
    name: str,
    model: type[Base],
    schema: type[BaseModel],
    create_schema: type[BaseModel],
) -> APIRouter:
    """Build list / get / create / update / delete endpoints for ``model``.

    ``name`` is the singular resource name used in messages ("Course"),
    ``schema`` is the response model and ``create_schema`` the request body.
    """
    plural = prefix.strip("/").capitalize()
    router = APIRouter(prefix=prefix, tags=[plural])

    def get_or_404(item_id: int, db: Session):
        item = db.get(model, item_id)
        if item is None:
            raise HTTPException(404, f"{name} not found")
        return item

    @router.get("/", response_model=list[schema], summary=f"List {plural}")
    def list_items(db: Session = Depends(get_db)):
        return db.query(model).all()

    @router.get("/{item_id}", response_model=schema, summary=f"Get {name}")
    def get_item(item_id: int, db: Session = Depends(get_db)):
        return get_or_404(item_id, db)

    @router.post("/", response_model=schema, summary=f"Create {name}")
    def create_item(data: create_schema, db: Session = Depends(get_db)):
        item = model(**data.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @router.put("/{item_id}", response_model=schema, summary=f"Update {name}")
    def update_item(item_id: int, data: create_schema, db: Session = Depends(get_db)):
        item = get_or_404(item_id, db)
        for field, value in data.model_dump().items():
            setattr(item, field, value)
        db.commit()
        db.refresh(item)
        return item

    @router.delete("/{item_id}", summary=f"Delete {name}")
    def delete_item(item_id: int, db: Session = Depends(get_db)):
        db.delete(get_or_404(item_id, db))
        db.commit()
        return {"message": f"{name} deleted"}

    return router
