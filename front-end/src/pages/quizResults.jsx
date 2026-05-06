import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score || 0;
  const total = location.state?.total || 0;
  const answers = location.state?.answers || [];
  const submissionKey = location.state?.submissionKey || null;
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const sendResults = async () => {
      try {
        if (!submissionKey) {
          setSaveMessage('Could not save quiz progress this time.');
          return;
        }

        const storageKey = `quiz-submitted:${submissionKey}`;
        if (sessionStorage.getItem(storageKey)) {
          setSaveMessage('Quiz progress already saved.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/quiz/result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ answers }),
        });

        if (!response.ok) {
          throw new Error('Could not save quiz progress');
        }

        const data = await response.json();
        const savedCount = Array.isArray(data.updatedWordIds) ? data.updatedWordIds.length : 0;
        sessionStorage.setItem(storageKey, '1');
        setSaveMessage(`Saved progress for ${savedCount} words.`);
      } catch (error) {
        console.error('Error sending quiz results:', error);
        setSaveMessage('Could not save quiz progress this time.');
      }
    };

    sendResults();
  }, [answers, submissionKey]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', margin: '0 auto' }}>
      <h1>Quiz Results</h1>
      <h2>
        You got {score} out of {total}
      </h2>
      <p>{saveMessage}</p>
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