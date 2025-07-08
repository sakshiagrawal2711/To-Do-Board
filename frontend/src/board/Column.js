import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import '../styles/index.css'; // Import custom scrollbar styles

export default function Column({ title, tasks }) {
  const getHeaderColor = (title) => {
    switch (title) {
      case 'Todo':
        return '#0079bf'; // Blue
      case 'In Progress':
        return '#ffb347'; // Orange
      case 'Done':
        return '#61bd4f'; // Green
      default:
        return '#1f2a44'; // Fallback
    }
  };

  const columnStyle = {
    backgroundColor: '#1e1e2f',
    borderRadius: '16px',
    padding: '16px',
    width: '300px',
    minHeight: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    backgroundColor: getHeaderColor(title),
    color: '#fff',
    padding: '10px',
    marginBottom: '16px',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    letterSpacing: '0.5px',
  };

  return (
    <div style={columnStyle} className="scrollable-column">
      <h3 style={headerStyle}>{title}</h3>
      <Droppable droppableId={title}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
