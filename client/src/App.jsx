import Navbar from "./components/Navbar"
import { use, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import { Divide } from "lucide-react";

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
    <Layout user={currentUser} onLogout={handleLogout} >
      <Outlet />
    </Layout>
  }

  return (
    <>
      <Routes>
        
        <Route path="/login" element={<div className="fixed inset-0 flex items-center justify-center bg-gray-100">

        </div> }/>
        <Route path="/" element={<Layout />} />

      </Routes>
    </>
  )
}

export default App
