import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import './App.css';
import './styles/button.css';
import Header from './components/header.jsx';
import QuizPage from './pages/quizPage.jsx';
import QuizResults from './pages/quizResults.jsx';
import AddWord from './pages/addWord.jsx';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-results" element={<QuizResults />} />
        <Route path="/add-word" element={<AddWord />} />
      </Routes>
    </>
  );
};

export default App;