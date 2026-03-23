import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
    <div>
        <h1>Home</h1>
        <div>
            <button onClick={() => navigate('/addWord')}>
                Add Word
            </button>
            <button onClick={() => navigate('/quizPage')}>
                Take a Vocab Quiz
            </button>
            <button onClick={() => navigate('/reverseDict')}>
                Find A Word From The Definition
            </button>
            <button onClick={() => navigate('/wordList')}>
                View Word Bank
            </button>
      </div>
    </div>

    );
  };

export default Home;