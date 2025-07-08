import React, { useEffect, useState } from 'react';
import socket from '../utils/socket';

const ActionLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('action-log', (log) => {
      setLogs((prev) => [log, ...prev.slice(0, 19)]);
    });

    return () => socket.off('action-log');
  }, []);

  return (
    <div style={logContainerStyle}>
      <ul style={listStyle}>
        {logs.map((log, i) => (
          <li key={i} style={logItemStyle}>
            <strong>{log.user}</strong> {log.action}{' '}
            <em>{log.task}</em> at{' '}
            <span style={timestampStyle}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionLog;
const logContainerStyle = {
  backgroundColor: '#2c2c3e',
  color: '#fff',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  fontFamily: 'sans-serif',
  maxHeight: '300px',
  overflowY: 'auto',
  marginTop: '20px',
};

const headingStyle = {
  fontSize: '20px',
  marginBottom: '12px',
  borderBottom: '1px solid #444',
  paddingBottom: '6px',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const logItemStyle = {
  backgroundColor: '#3a3a4f',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  fontSize: '14px',
};

const timestampStyle = {
  color: '#ccc',
  fontSize: '12px',
};
