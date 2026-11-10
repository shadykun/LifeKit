from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    duration = Column(Integer)  # seconds
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", back_populates="videos")


class Text(Base):
    __tablename__ = "texts"

    id = Column(Integer, primary_key=True, index=True)
    body_content = Column(String)

    # A text block can embed several images.
    images = relationship("Image", back_populates="text")


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    alt_text = Column(String)
    course_id = Column(Integer, ForeignKey("courses.id"))
    # Set only when the image is embedded in a text block.
    text_id = Column(Integer, ForeignKey("texts.id"), nullable=True)

    course = relationship("Course", back_populates="images")
    text = relationship("Text", back_populates="images")
