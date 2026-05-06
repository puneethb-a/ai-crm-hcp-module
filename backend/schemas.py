from pydantic import BaseModel
from datetime import datetime

class InteractionCreate(BaseModel):
    hcp_name: str
    date: datetime
    summary: str
    key_points: str
    next_action: str