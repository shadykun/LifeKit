from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Video(Base):
    __tablename__ = 'videos'

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    duration = Column(Integer) # Durata în secunde
    
    course_id = Column(Integer, ForeignKey('courses.id'))
    course = relationship("Course", back_populates="videos")

class Text(Base):
    __tablename__ = 'texts'

    id = Column(Integer, primary_key=True, index=True)
    body_content = Column(String) # Sau Text type pentru conținut lung

    # Un text poate avea mai multe imagini embeduite
    images = relationship("Image", back_populates="text")

class Image(Base):
    __tablename__ = 'images'

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    alt_text = Column(String)
    
    # Legături duble conform diagramei:
    # 1. Aparține unui Curs
    course_id = Column(Integer, ForeignKey('courses.id'))
    course = relationship("Course", back_populates="images")
    
    # 2. Poate fi embeduită într-un Text (nullable=True în caz că e doar imagine de curs)
    text_id = Column(Integer, ForeignKey('texts.id'), nullable=True)
    text = relationship("Text", back_populates="images")