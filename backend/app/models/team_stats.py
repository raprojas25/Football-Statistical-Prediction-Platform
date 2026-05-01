from sqlalchemy import Column, Integer, Float, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class TeamStats(Base):
    __tablename__ = "team_stats"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    match_date = Column(Date, nullable=False)
    is_home = Column(Boolean, nullable=False)

    goals_scored = Column(Float)
    goals_conceded = Column(Float)
    total_goals = Column(Float)
    over_1_5 = Column(Float)
    over_2_5 = Column(Float)
    over_3_5 = Column(Float)
    both_teams_scored = Column(Float)

    win_rate = Column(Float)
    draw_rate = Column(Float)
    defeat_rate = Column(Float)

    scored_first_rate = Column(Float)
    conceded_first_rate = Column(Float)

    corners_for_avg = Column(Float)
    corners_against_avg = Column(Float)
    total_corners_avg = Column(Float)
    corners_over_2_5 = Column(Float)
    corners_over_3_5 = Column(Float)

    scoring_rate = Column(Float)
    scoring_rate_1st_half = Column(Float)
    scoring_rate_2nd_half = Column(Float)
    conceding_rate = Column(Float)

    created_at = Column(DateTime, default=func.now())

    team = relationship("Team", back_populates="stats")