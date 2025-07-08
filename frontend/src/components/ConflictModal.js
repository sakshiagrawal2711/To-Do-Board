import React from 'react';

const ConflictModal = ({ conflictData, onResolve, onCancel }) => {
  const { server, client } = conflictData;

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
    backgroundColor: '#1E1E2F',
    color: '#fff',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    fontFamily: 'sans-serif',
  };

  const versionBox = {
    backgroundColor: '#2c2c3e',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    wordWrap: 'break-word',
  };

  const buttonContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  };

  const buttonStyle = {
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    width: '100%',
  };

  const overwriteBtn = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: '#fff',
  };

  const keepServerBtn = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: '#fff',
  };

  const cancelBtn = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: '#fff',
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : '—';

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>⚠️ Conflict Detected</h2>
        <p>This task was modified by another user. Choose how to resolve the conflict:</p>

        <div style={versionBox}>
          <h3>🧠 Your Version</h3>
          <p><strong>Title:</strong> {client.title}</p>
          <p><strong>Description:</strong> {client.description}</p>
          <p><strong>Status:</strong> {client.status}</p>
          <p><strong>Last Updated:</strong> {formatDate(client.lastUpdated)}</p>
        </div>

        <div style={versionBox}>
          <h3>🌐 Server Version</h3>
          <p><strong>Title:</strong> {server.title}</p>
          <p><strong>Description:</strong> {server.description}</p>
          <p><strong>Status:</strong> {server.status}</p>
          <p><strong>Last Updated:</strong> {formatDate(server.lastUpdated)}</p>
        </div>

        <div style={buttonContainer}>
          <button style={overwriteBtn} onClick={() => onResolve('client')}>✅ Overwrite with Mine</button>
          <button style={keepServerBtn} onClick={() => onResolve('server')}>🔄 Keep Server Version</button>
          <button style={cancelBtn} onClick={onCancel}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
