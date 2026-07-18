import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 80px;
  height: 100vh;
  background-color: var(--background-secondary);
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 100;
  border-right: 1px solid var(--border);
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  border-radius: 8px;
  width: 60px;
  
  &:hover {
    color: var(--text);
    background-color: var(--background-tertiary);
  }
  
  ${({ active }) => active && `
    color: var(--primary);
    background-color: var(--background-tertiary);
  `}
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
`;

const NavLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1rem;
  
  span {
    color: var(--secondary);
  }
`;

const UserSection = styled.div`
  margin-top: auto;
  padding: 1rem 0;
  border-top: 1px solid var(--border);
  width: 100%;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--background-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-weight: 600;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', name: 'home' },
    { path: '/foryou', icon: '👥', label: 'For You', name: 'foryou' },
    { path: '/trending', icon: '🔥', label: 'Trending', name: 'trending' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarContainer>
      <Logo onClick={() => navigate('/')}>CV</Logo>
      
      {navItems.map((item) => (
        <NavItem 
          key={item.name} 
          active={isActive(item.path)}
          onClick={() => navigate(item.path)}
        >
          <NavIcon>{item.icon}</NavIcon>
          <NavLabel>{item.label}</NavLabel>
        </NavItem>
      ))}
      
      {user && (
        <NavItem onClick={() => navigate('/upload')}>
          <NavIcon>➕</NavIcon>
          <NavLabel>Create</NavLabel>
        </NavItem>
      )}
      
      <UserSection>
        {user ? (
          <UserAvatar onClick={() => navigate(`/profile/${user._id}`)}>
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </UserAvatar>
        ) : (
          <NavItem onClick={() => navigate('/login')}>
            <NavIcon>👤</NavIcon>
            <NavLabel>Login</NavLabel>
          </NavItem>
        )}
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar;
