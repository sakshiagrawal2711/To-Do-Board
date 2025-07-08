import React from 'react';

export default function Footer() {
  const footerStyle = {
    backgroundColor: '#0c2d48',
    color: '#aaa',
    padding: '16px 24px',
    textAlign: 'center',
    fontSize: '14px',
    borderTop: '1px solid #333',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 999,
  };

  return (
    <footer style={footerStyle}>
      © {new Date().getFullYear()} Real-Time To-Do Board · Built with 💻 by Sakshi
    </footer>
  );
}
