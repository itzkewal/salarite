import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('hr'); // 'hr' or 'employee'
  const [tasks, setTasks] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigned_to: '' });
  const [interviewForm, setInterviewForm] = useState({ candidate_name: '', position: '', scheduled_at: '' });

  const fetchData = useCallback(async () => {
    try {
      const tasksRes = await axios.get(`${API_BASE_URL}/tasks/`);
      const interviewsRes = await axios.get(`${API_BASE_URL}/interviews/`);
      setTasks(tasksRes.data);
      setInterviews(interviewsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Real-time updates: auto refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/tasks/`, taskForm);
      setTaskForm({ title: '', description: '', assigned_to: '' });
      fetchData();
    } catch (error) {
      alert("Error creating task");
    }
  };

  const handleCreateInterview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/interviews/`, interviewForm);
      setInterviewForm({ candidate_name: '', position: '', scheduled_at: '' });
      fetchData();
    } catch (error) {
      alert("Error scheduling interview");
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert("Error updating status");
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">Salarite Virtual HR</div>
        <div className="refresh-indicator">
          <div className="dot"></div>
          Live Sync Active
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'employee' ? 'active' : ''}`}
          onClick={() => setActiveTab('employee')}
        >
          Employee Workspace
        </button>
        <button
          className={`tab-btn ${activeTab === 'hr' ? 'active' : ''}`}
          onClick={() => setActiveTab('hr')}
        >
          Virtual HR Dashboard
        </button>
      </div>

      {activeTab === 'employee' ? (
        <div className="dashboard-grid">
          <div className="card">
            <h2>Assign Task to Virtual HR</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Please review my leaves"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description / Request</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Details about your request for HR..."
                  required
                ></textarea>
              </div>
              <div className="form-group" style={{ display: 'none' }}>
                <label>Assign To</label>
                <input
                  type="text"
                  value="Virtual HR"
                  readOnly
                />
              </div>
              <button type="submit" className="btn-primary" onClick={() => setTaskForm({ ...taskForm, assigned_to: 'Virtual HR' })}>Send to HR</button>
            </form>
          </div>

          <div className="card">
            <h2>Recent Requests Status</h2>
            <div className="task-list">
              {tasks.length === 0 && <p style={{ color: '#94a3b8' }}>You haven't made any requests yet.</p>}
              {tasks.map(task => (
                <div key={task.id} className="task-item">
                  <div>
                    <h4 style={{ marginBottom: '0.2rem' }}>{task.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Status: {task.status}</p>
                  </div>
                  <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '')}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="card">
            <h2>Schedule New Interview</h2>
            <form onSubmit={handleCreateInterview}>
              <div className="form-group">
                <label>Candidate Name</label>
                <input
                  type="text"
                  value={interviewForm.candidate_name}
                  onChange={(e) => setInterviewForm({ ...interviewForm, candidate_name: e.target.value })}
                  placeholder="e.g. Kewal Parekh"
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={interviewForm.position}
                  onChange={(e) => setInterviewForm({ ...interviewForm, position: e.target.value })}
                  placeholder="e.g. Python Developer"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewForm.scheduled_at}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduled_at: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Schedule Now</button>
            </form>

            <h2 style={{ marginTop: '2rem' }}>Upcoming Interviews</h2>
            <div className="interview-list">
              {interviews.length === 0 && <p style={{ color: '#94a3b8' }}>No interviews scheduled.</p>}
              {interviews.map(interview => (
                <div key={interview.id} className="interview-item">
                  <div>
                    <h4 style={{ marginBottom: '0.2rem' }}>{interview.candidate_name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{interview.position}</p>
                    <p style={{ fontSize: '0.7rem', color: '#6366f1' }}>
                      {new Date(interview.scheduled_at).toLocaleString()}
                    </p>
                  </div>
                  <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="btn-sm btn-call">Join Call</a>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Task Inbox (Virtual HR View)</h2>
            <div className="task-list">
              {tasks.length === 0 && <p style={{ color: '#94a3b8' }}>No tasks from employees yet.</p>}
              {tasks.map(task => (
                <div key={task.id} className="task-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h4>{task.title}</h4>
                      <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '')}`}>
                        {task.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{task.description}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Requested by Employee</p>
                  </div>
                  <div className="action-btns">
                    {task.status === 'Pending' && (
                      <button onClick={() => updateTaskStatus(task.id, 'In Progress')} className="btn-sm" style={{ background: '#6366f1', color: 'white' }}>Mark as Seen</button>
                    )}
                    {task.status === 'In Progress' && (
                      <button onClick={() => updateTaskStatus(task.id, 'Completed')} className="btn-sm" style={{ background: '#22c55e', color: 'white' }}>Confirm Resolved</button>
                    )}
                    {task.status === 'Completed' && (
                      <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Resolved ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
