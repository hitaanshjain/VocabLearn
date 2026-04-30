import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/quiz', {
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
    const correctAnswer = questions[currentQuestion].answer;
    let newScore = score;

    if (choice === correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }

    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      navigate('/quiz-results', {
        state: {
          score: newScore,
          total: questions.length,
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
      <div
        style={{
          width: `${progressPercent}%`,
          height: '100%',
          backgroundColor: '#111827',
          transition: 'width 200ms ease',
        }}
      />
    </div>
    </div>
  );
}

export default QuizPage;