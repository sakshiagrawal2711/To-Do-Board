import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import socket from '../utils/socket'; // ✅ centralized import

export default function ActionLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();

    if (!socket) return;

    // ✅ Attach socket listener
    socket.on('action-log', (log) => {
      setLogs((prev) => [log, ...prev]); // Add new log at top
    });

    // ✅ Clean up
    return () => socket.off('action-log');
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/logs');
      setLogs(res.data.reverse()); // Latest first
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  return (
    <div style={logStyle}>
      <h3 style={{ marginBottom: '12px' }}>Activity Log</h3>
      {logs.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <ul style={{ paddingLeft: '18px', listStyle: 'disc', margin: 0 }}>
          {logs.map((log, idx) => (
            <li key={log._id || idx} style={{ marginBottom: '10px' }}>
              <strong>{log.user?.username || 'Unknown'}</strong> {log.action}{' '}
              <em>{log.taskTitle || log.task}</em>
              <br />
              <small>{new Date(log.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const logStyle = {
  maxWidth: '100%',
  margin: '0 auto',
  padding: '16px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  fontFamily: 'sans-serif',
  height: 'calc(100% - 20px)',
  overflowY: 'auto',
};
