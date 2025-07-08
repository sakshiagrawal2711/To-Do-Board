import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Board from './board/Board';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ActionLog from './logs/ActionLog';
import Footer from './components/Footer';


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// ✅ Layout: Board on the left, Log on the right
// ✅ Updated BoardWithLogs function
function BoardWithLogs() {
  const layoutStyle = {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '80px',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#28282B',
    minHeight: '1000vh',
    boxSizing: 'border-box',
    overflow: 'hidden',
    
  };

  const boardStyle = {
    flex: 3,
    marginRight: '24px',
    overflow: 'hidden',
    borderRadius: '12px',  
  };

  const logStyle = {
    flex: 0.7,
    background: 'linear-gradient(135deg, #1e1e2f, #121212)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    height: '118vh',
    overflow: 'hidden',
    color:' #FFFFFF',
  };

  return (
    <div style={layoutStyle}>
      <div style={boardStyle}>
        <Board />
      </div>
      <div style={logStyle}>
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>📜 Activity Log</h3>
        <ActionLog />
      </div>
    </div>
  );
}



function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/board"
          element={
            <PrivateRoute>
              <BoardWithLogs />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
