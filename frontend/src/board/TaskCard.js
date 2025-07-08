import { Draggable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import '../styles/index.css';
import ConflictModal from '../components/ConflictModal';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function TaskCard({ task, index }) {
  const { token } = useAuth();
  const [hover, setHover] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleUpdate = async (updatedTask) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        ...updatedTask,
        lastUpdatedClient: task.lastUpdated // ✅ send this for conflict detection
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      if (err.response?.status === 409) {
        const { serverVersion, clientVersion } = err.response.data;
        setConflictData({ server: serverVersion, client: clientVersion });
        setShowConflictModal(true);
      } else {
        console.error("Update failed:", err);
      }
    }
  };

  const handleResolve = async (choice) => {
    const resolved = choice === 'client' ? conflictData.client : conflictData.server;
    try {
      await API.put(`/tasks/${task._id}`, {
        ...resolved,
        lastUpdatedClient: conflictData.server.lastUpdated, // ✅ retry with correct lastUpdated
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowConflictModal(false);
      setConflictData(null);
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  const handleEdit = () => {
    const updatedTitle = prompt("Edit Title", task.title);
    if (!updatedTitle || updatedTitle === task.title) return;

    const updatedTask = {
      ...task,
      title: updatedTitle,
    };

    handleUpdate(updatedTask);
  };

  const handleSmartAssign = async () => {
    try {
      const res = await API.post(`/tasks/${task._id}/smart-assign`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Smart Assigned to:", res.data.assignedTo);
    } catch (err) {
      console.error("Smart assign failed", err);
      alert("Smart assign failed. Try again.");
    }
  };

  const handleAssignChange = async (e) => {
    const userId = e.target.value;
    try {
      await API.put(`/tasks/${task._id}`, {
        ...task,
        assignedTo: userId || null,
        lastUpdatedClient: task.lastUpdated, // ✅ Add for manual assignment too
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Manual assignment failed", err);
    }
  };

  const cardStyle = {
    perspective: '1000px',
    marginBottom: '12px'
  };

  const innerStyle = {
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    position: 'relative',
    transform: flipped ? 'rotateY(180deg)' : 'none',
  };

  const faceStyle = {
    backfaceVisibility: 'hidden',
    borderRadius: '10px',
    backgroundColor: '#3a3a4f',
    color: '#ffffff',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    minHeight: '200px',
  };

  const backStyle = {
    ...faceStyle,
    position: 'absolute',
    top: 0,
    left: 0,
    transform: 'rotateY(180deg)'
  };

  const selectStyle = {
    marginTop: '10px',
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #555',
    backgroundColor: '#2c2c3e',
    color: '#fff',
    fontSize: '14px',
  };

  const actionButtonStyle = {
    padding: '6px 10px',
    fontSize: '13px',
    backgroundColor: '#0079bf',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{ ...provided.draggableProps.style, ...cardStyle }}
            onClick={() => setFlipped(!flipped)}
          >
            <div style={innerStyle}>
              {/* Front Face */}
              <div style={faceStyle}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <small>Assigned: {task.assignedTo?.username || 'Unassigned'}</small>

                <select
                  value={task.assignedTo?._id || ''}
                  onChange={handleAssignChange}
                  style={selectStyle}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username}
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  <button
                    style={actionButtonStyle}
                    onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={actionButtonStyle}
                    onClick={(e) => { e.stopPropagation(); handleSmartAssign(); }}
                  >
                    🎯 Smart Assign
                  </button>
                </div>
              </div>

              {/* Back Face */}
              <div style={backStyle}>
                <h4>📝 Task Details</h4>
                <p>ID: {task._id}</p>
                <p>Status: {task.status}</p>
                <p>Updated At: {new Date(task.lastUpdated || task.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {showConflictModal && (
        <ConflictModal
          conflictData={conflictData}
          onResolve={handleResolve}
          onCancel={() => setShowConflictModal(false)}
        />
      )}
    </>
  );
}
