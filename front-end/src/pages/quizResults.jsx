import { useLocation, useNavigate } from 'react-router-dom';

function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score || 0;
  const total = location.state?.total || 0;

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Quiz Results</h1>
      <h2>
        You got {score} out of {total}
      </h2>

      <button onClick={() => navigate('/quiz')}>Try Again</button>
    </div>
  );
}

export default QuizResults;