from sqlalchemy import Column, Integer, String, DateTime, Enum
import enum
from database import Base
from datetime import datetime

class TaskStatus(str, enum.Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default=TaskStatus.PENDING)
    assigned_to = Column(String, index=True) # Employee Name
    created_at = Column(DateTime, default=datetime.utcnow)

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String, index=True)
    position = Column(String)
    scheduled_at = Column(DateTime)
    meeting_link = Column(String, default="https://meet.google.com/placeholder")
    created_at = Column(DateTime, default=datetime.utcnow)
