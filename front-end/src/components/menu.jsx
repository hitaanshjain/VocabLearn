import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/menu.css';

const Menu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="drawer-overlay" onClick={onClose} />
      )}
      <div className={`drawer ${isOpen ? 'drawer-open' : ''}`}>
        <button className = "menu-button" onClick={() => handleNav('/add-word')}>Add Word</button>
        <button className = "menu-button" onClick={() => handleNav('/quiz')}>Take a Vocab Quiz</button>
        <button className = "menu-button" onClick={() => handleNav('/reverse-dict')}>Find A Word From The Definition</button>
        <button className = "menu-button" onClick={() => handleNav('/word-list')}>View Word Bank</button>
      </div>
    </>
  );
};

export default Menu;