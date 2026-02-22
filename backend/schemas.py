from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
import enum

class TaskStatus(str, enum.Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class TaskBase(BaseModel):
    title: str
    description: str
    status: TaskStatus = TaskStatus.PENDING
    assigned_to: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    status: Optional[TaskStatus] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class InterviewBase(BaseModel):
    candidate_name: str
    position: str
    scheduled_at: datetime
    meeting_link: Optional[str] = "https://meet.google.com/placeholder"

class InterviewCreate(InterviewBase):
    pass

class InterviewResponse(InterviewBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
