import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

// Import pages
import HomePage from './pages/HomePage';
import ForYouPage from './pages/ForYouPage';
import TrendingPage from './pages/TrendingPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import HashtagPage from './pages/HashtagPage';
import VideoPage from './pages/VideoPage';

// Import components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #000;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 80px;
  padding: 20px;
  max-width: calc(100vw - 80px);
  
  @media (max-width: 1200px) {
    margin-left: 0;
    max-width: 100%;
  }
`;

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Hide navbar on auth pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  if (loading) {
    return (
      <AppContainer>
        <MainContent className="flex items-center justify-center">
          <div className="text-2xl font-bold text-primary">Loading...</div>
        </MainContent>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      {!hideNavbar && <Sidebar user={user} onLogout={handleLogout} />}
      
      <MainContent>
        {!hideNavbar && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/foryou" element={<ForYouPage user={user} />} />
          <Route path="/trending" element={<TrendingPage user={user} />} />
          <Route path="/upload" element={user ? <UploadPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={<ProfilePage user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />} />
          <Route path="/search" element={<SearchPage user={user} />} />
          <Route path="/hashtag/:hashtag" element={<HashtagPage user={user} />} />
          <Route path="/video/:id" element={<VideoPage user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
};

export default App;
