import { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import API from '../api/axios';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CreateTaskModal from '../components/CreateTaskModal';

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  const columns = ['Todo', 'In Progress', 'Done'];

  useEffect(() => {
    fetchTasks();
    socket.on('taskUpdated', fetchTasks);
    socket.on('taskCreated', fetchTasks);
    socket.on('taskDeleted', fetchTasks);
    return () => {
      socket.off('taskUpdated');
      socket.off('taskCreated');
      socket.off('taskDeleted');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tasks');
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    try {
      await API.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
    } catch (err) {
      console.error('Drag-drop update failed:', err);
    }
  };

  // ✅ Updated Styles
const containerStyle = {
  padding: '100px 24px 24px 24px',
  fontFamily: 'sans-serif',
  background: 'linear-gradient(135deg, #1e1e2f, #121212)',
  minHeight: '100vh',
  overflowX: 'auto',
};

const headerStyle = {
  fontSize: '28px',
  fontWeight: '600',
  marginBottom: '20px',
  color: '#ffffff',
  textAlign: 'center',
};

const columnsStyle = {
  display: 'flex',
  gap: '20px',
  overflowX: 'auto',
  paddingBottom: '12px',
};

const columnStyle = {
  flex: '1',
  minWidth: '300px',
  maxWidth: '350px',
  backgroundColor: '#2c2c3e',
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  display: 'flex',
  flexDirection: 'column',
};

const columnHeaderStyle = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '12px',
  textAlign: 'center',
  borderBottom: '1px solid #444',
  paddingBottom: '8px',
};

const errorStyle = {
  color: '#ff6b6b',
  fontSize: '14px',
};

const buttonStyle = {
  padding: '10px 16px',
  marginBottom: '20px',
  backgroundColor: '#2196F3',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
};


  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headerStyle}>Welcome, {user?.username}</h2>
        <button style={buttonStyle} onClick={() => setShowCreateModal(true)}>
          + New Task
        </button>
        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p style={errorStyle}>{error}</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div style={columnsStyle}>
              {columns.map((col) => (
                <Column
                  key={col}
                  title={col}
                  tasks={tasks.filter((t) => t.status === col)}
                />
              ))}
            </div>
          </DragDropContext>
        )}

        {/* ✅ Task Creation Modal */}
        {showCreateModal && (
          <CreateTaskModal
            onClose={() => setShowCreateModal(false)}
            onTaskCreated={fetchTasks}
          />
        )}
      </div>
    </>
  );
}
