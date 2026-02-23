# Salarite Virtual HR Dashboard

A simple yet powerful Task Management and Interview Scheduling system.

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React.js
- **Database**: SQLite

## How to Run

### 1. Setup Backend
1. Open a terminal in the `backend/` folder.
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings
   ```
3. Start the API server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will start at `http://localhost:8000`.

### 2. Setup Frontend
1. Open a terminal in the `frontend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The dashboard will open at `http://localhost:3000`.

## Features
- **Employee Workspace**: Create tasks, Assign them to Virtual HR.
- **Virtual HR**: View assigned tasks, Schedule interviews.
- **Real-time Sync**: The dashboard auto-refreshes every 5 seconds to keep data updated.
- **Interview Placeholder**: Join calls directly from the dashboard.
