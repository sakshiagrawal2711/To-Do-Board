import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const wrapperStyle = {
  minHeight: '100vh',
  backgroundColor: '#f4f4f4',
  margin: 0,
  padding: 0,
  fontFamily: 'sans-serif',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={wrapperStyle}>
      <App />
    </div>
  </React.StrictMode>
);
