from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import Account as AccountModel
from schemas import Account, AccountCreate

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.get("/", response_model=list[Account])
def get_accounts(db: Session = Depends(get_db)):
    return db.query(AccountModel).all()


@router.get("/{acc_id}", response_model=Account)
def get_account(acc_id: int, db: Session = Depends(get_db)):
    acc = db.query(AccountModel).filter_by(id=acc_id).first()
    if not acc:
        raise HTTPException(404, "Account not found")
    return acc


@router.post("/", response_model=Account)
def create_account(data: AccountCreate, db: Session = Depends(get_db)):
    acc = AccountModel(**data.dict())
    db.add(acc)
    db.commit()
    db.refresh(acc)
    return acc


@router.put("/{acc_id}", response_model=Account)
def update_account(acc_id: int, data: AccountCreate, db: Session = Depends(get_db)):
    acc = db.query(AccountModel).filter_by(id=acc_id).first()
    if not acc:
        raise HTTPException(404, "Account not found")
    for k, v in data.dict().items():
        setattr(acc, k, v)
    db.commit()
    return acc


@router.delete("/{acc_id}")
def delete_account(acc_id: int, db: Session = Depends(get_db)):
    acc = db.query(AccountModel).filter_by(id=acc_id).first()
    if not acc:
        raise HTTPException(404, "Account not found")
    db.delete(acc)
    db.commit()
    return {"message": "Account deleted"}
