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
import WordList from './pages/wordList.jsx';
import WordPage from './pages/wordPage.jsx';
import EditWord from './pages/editWord.jsx';
import SearchWord from './pages/searchWord.jsx';
import Register from './pages/register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        username={username}
        setUsername={setUsername}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-results" element={<QuizResults />} />
        <Route path="/word-list" element={<WordList />} />
        <Route path="/word/:id" element={<WordPage />} />
        <Route path="/word/:id/edit" element={<EditWord />} />
        <Route path="/search" element={<SearchWord />} />
        <Route path="/add-word" element={<AddWord />} />
        <Route
          path="/reverse-dict"
          element={<Navigate to="/search?mode=definition" replace />}
        />
      </Routes>
    </>
  );
}

export default App;