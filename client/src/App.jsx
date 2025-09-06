import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    else{
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuth = data => {
    const userData = {
      name: data.name || 'User',
      email: data.email,
      avatar: data.avatar || null
    };
    setCurrentUser(userData);
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const ProtectedLayout = () => {
    return (
      <Layout user={currentUser} onLogout={handleLogout} >
        <Outlet />
      </Layout>
    );
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onAuth={handleAuth} />} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
