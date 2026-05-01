from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"))

    predicted_winner = Column(String(10))
    over_1_5_probability = Column(Float)
    over_2_5_probability = Column(Float)
    over_3_5_probability = Column(Float)
    btts_probability = Column(Float)
    corners_over_9_5_probability = Column(Float)
    confidence_level = Column(String(20))

    created_at = Column(DateTime, default=func.now())

    match = relationship("Match", back_populates="predictions")