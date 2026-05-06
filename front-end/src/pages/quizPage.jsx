import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/quiz`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Could not load quiz');
        }

        const data = await response.json();

        const quizQuestions = Array.isArray(data) ? data : [data];
        setQuestions(quizQuestions);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchQuiz();
  }, []);

  const handleAnswer = (choice) => {
    const current = questions[currentQuestion];
    const correctAnswer = current.answer;
    let newScore = score;
    const isCorrect = choice === correctAnswer;

    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    const nextAnswers = [
      ...answers,
      {
        wordId: current.id,
        isCorrect,
      },
    ];
    setAnswers(nextAnswers);

    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      const submissionKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      navigate('/quiz-results', {
        state: {
          score: newScore,
          total: questions.length,
          answers: nextAnswers,
          submissionKey,
        },
      });
    }
  };

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Quiz</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Quiz</h1>
        <p>Loading quiz...</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', height: '10px', margin: '0 auto 20px', backgroundColor: '#ffffff', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#111827', transition: 'width 200ms ease' }} />
    </div>
      <h1>Quiz</h1>
      <h2>Which word matches this definition?</h2>
      <p>{question.question}</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '300px',
          margin: '20px auto',
        }}
      >
        {question.options.map((option) => (
          <button key={option} type="button" onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>
      <div
      style={{
        width: '100%',
        maxWidth: '420px',
        height: '10px',
        margin: '16px auto 20px',
        backgroundColor: '#e5e7eb',
        borderRadius: '999px',
        overflow: 'hidden',
      }}
    >
    </div>
    </div>
  );
}

export default QuizPage;