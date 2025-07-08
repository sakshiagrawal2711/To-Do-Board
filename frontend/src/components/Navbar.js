import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ✅ Styling
  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#0c2d48',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  };

  const logoStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const usernameStyle = {
    fontWeight: 500,
    fontSize: '15px',
  };

  const buttonStyle = {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#e04345',
  };
  const avatarStyle = {
    // backgroundColor: '#ffffff20',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '20px',
    color: '#fffff',
    fontWeight: 500,
  };

  return (
    <div style={navbarStyle}>
      <div style={logoStyle}>📋 Real-Time Board</div>
      <div style={rightSectionStyle}>
        {/* {user?.username && <span style={usernameStyle}>Welcome, {user.username}</span>} */}
        <div style={avatarStyle}>👤 {user?.username}</div>
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#e04345')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4d4f')}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
