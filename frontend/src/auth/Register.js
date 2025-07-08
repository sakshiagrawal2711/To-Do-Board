import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { username, email, password });
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  // Inline styles
const containerStyle = {
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
  padding: '10px 14px',
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
  backgroundColor: '#1890ff',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '24px',
  fontSize: '24px',
  color: '#ffffff',
};


  return (
    <form onSubmit={handleRegister} style={containerStyle}>
      <h2 style={headingStyle}>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>Register</button>
    </form>
  );
}
