import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Menu from './menu.jsx';
import '../styles/header.css';

const Header = ({ isLoggedIn, setIsLoggedIn, username, setUsername }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <>
    <Menu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

    <header className="header">
      <div className="header-left">
        {!isAuthPage && (
          <>
            <button onClick={() => setDrawerOpen(true)}>&#9776;</button>
            <button onClick={() => navigate('/home')}>Home</button>
          </>
        )}
      </div>

      <h1 className="header-logo">VocabLearn</h1>

      <div className="header-right">
        {!isLoggedIn ? (
          !isAuthPage && <button onClick={() => navigate('/login')}>Login</button>
        ) : (
          <>
            <span className="welcome-text">{`Welcome, ${username}`}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;