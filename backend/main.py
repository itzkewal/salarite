from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, database
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salarite Virtual HR API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Salarite Virtual HR API"}

# --- Task Endpoints ---

@app.post("/tasks/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model=List[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@app.patch("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task_status(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task_update.status:
        db_task.status = task_update.status
    
    db.commit()
    db.refresh(db_task)
    return db_task

# --- Interview Endpoints ---

@app.post("/interviews/", response_model=schemas.InterviewResponse)
def create_interview(interview: schemas.InterviewCreate, db: Session = Depends(get_db)):
    db_interview = models.Interview(**interview.dict())
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

@app.get("/interviews/", response_model=List[schemas.InterviewResponse])
def get_interviews(db: Session = Depends(get_db)):
    return db.query(models.Interview).all()
