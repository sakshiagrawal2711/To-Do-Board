import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      login(res.data.user);
      navigate('/board');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  // 🔧 Inline styles
  const formStyle = {
  maxWidth: '500px',
  margin: '80px auto',
  padding: '40px',
  borderRadius: '16px',
  backgroundColor: '#2c2c3e',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
  fontFamily: 'sans-serif',
  color: '#ffffff',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',         // Tighter horizontal spacing
  marginBottom: '18px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#3a3a4f',
  color: '#ffffff',
  fontSize: '15px',
  lineHeight: '1.4',
  outline: 'none',
  boxSizing: 'border-box',
};


const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#3a86ff',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const errorStyle = {
  color: '#ff6b6b',
  marginBottom: '16px',
  fontSize: '14px',
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '24px',
  fontSize: '24px',
  color: '#ffffff',
};

  return (
    <form onSubmit={handleLogin} style={formStyle}>
      <h2 style={headingStyle}>Login</h2>
      {error && <p style={errorStyle}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>Login</button>
      <p style={{ marginTop: '12px' }}>
      Don't have an account? <a href="/register">Register</a></p>
    </form>
  );
};

export default Login;
