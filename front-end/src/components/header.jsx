import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={() => navigate('/menu')}>&#9776;</button>
        <button onClick={() => navigate('/home')}>Home</button>
      </div>

      <h1 className="header-logo">VocabLearn</h1>

      <div className="header-right">
        {!isLoggedIn ? (
          <button onClick={() => navigate('/login')}>Login</button>
        ) : (
          <>
            <button onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;