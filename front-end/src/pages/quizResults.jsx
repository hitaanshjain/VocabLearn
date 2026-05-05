import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score || 0;
  const total = location.state?.total || 0;

  useEffect(() => {
    const sendResults = async () => {
      try {
        await fetch('https://vocab-learn-api.onrender.com/api/quiz/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ score, total }),
        });
      } catch (error) {
        console.error('Error sending quiz results:', error);
      }
    };

    sendResults();
  }, [score, total]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', margin: '0 auto' }}>
      <h1>Quiz Results</h1>
      <h2>
        You got {score} out of {total}
      </h2>
      <button
        onClick={() => navigate('/quiz')}
        className="try-again-button"
        style={{ marginTop: '44px' }}
      >
        Try Again
      </button>
    </div>
  );
}

export default QuizResults;