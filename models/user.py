from sqlalchemy import Column, Integer, String
from database import Base

class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    age = Column(Integer)
    username = Column(String, unique=True, nullable=False)
    
    # Opțional: poți adăuga relații aici dacă userii dețin cursuri