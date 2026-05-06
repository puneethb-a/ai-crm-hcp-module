from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from datetime import datetime

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255))
    date = Column(DateTime)
    summary = Column(Text)
    key_points = Column(Text)
    next_action = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)