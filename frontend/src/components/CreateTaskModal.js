import React, { useState } from 'react';
import API from '../api/axios';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';

export default function CreateTaskModal({ onClose, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [loading, setLoading] = useState(false);

  const { auth } = useAuth() || {};
  const token = auth?.token;

  // ✅ Normal Task Create
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const res = await API.post(
        '/tasks',
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit("taskCreated", res.data); // emit new task
      onTaskCreated();
      onClose();
    } catch (err) {
      console.error('❌ Task creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Smart Assign (Create then Assign)
  const handleSmartAssign = async () => {
    if (!title || !status) {
      alert("Title and status are required");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Task
      const createRes = await API.post(
        '/tasks',
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdTask = createRes.data;

      // Step 2: Smart Assign that task
      const assignRes = await API.post(
        `/tasks/${createdTask._id}/smart-assign`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit updated task
      socket.emit("taskUpdated", assignRes.data.task);
      onTaskCreated();
      onClose();
    } catch (err) {
      console.error("❌ Smart Assign Failed:", err);
      alert("Smart Assign failed: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Create New Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            style={{ ...inputStyle, height: '80px' }}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            style={inputStyle}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>

          <button
            type="button"
            onClick={handleSmartAssign}
            disabled={loading}
            style={{ ...buttonStyle, backgroundColor: '#28a745' }}
          >
            {loading ? 'Assigning...' : 'Smart Assign'}
          </button>

          <button
            type="button"
            onClick={onClose}
            style={cancelButtonStyle}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: '#2c2c3e',
  borderRadius: '12px',
  padding: '32px 28px',
  width: '400px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  fontFamily: 'sans-serif',
  color: '#fff',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '18px',
  borderRadius: '6px',
  border: '1px solid #555',
  backgroundColor: '#3a3a4f',
  color: '#fff',
  fontSize: '15px',
  boxSizing: 'border-box', // ✅ Ensures padding doesn't overflow
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#1e88e5', // 🔵 Modern blue
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
  marginBottom: '14px',
  transition: 'background-color 0.3s ease',
};

const smartAssignStyle = {
  ...buttonStyle,
  backgroundColor: '#43a047', // ✅ Material green
};

const cancelButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#424242', // ⚫ Neutral dark
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
};


