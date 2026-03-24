import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import './App.css';
import './styles/button.css';
import Header from './components/header.jsx';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
    <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace/>}/>
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
      <Route path="/home" element= {<Home />}/>
    </Routes>
    </>
  );
};

export default App;