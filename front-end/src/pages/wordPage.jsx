import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function WordPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [word, setWord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/words/${id}`);

        if (!response.ok) {
          throw new Error('Word not found');
        }

        const data = await response.json();
        setWord(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWord();
  }, [id]);

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Word Not Found</h1>
        <p>{error}</p>
        <button
          type="button"
          onClick={() => navigate('/word-list')}
          style={{ margin: '16px auto' }}
        >
          Back to Word Bank
        </button>
      </div>
    );
  }

  if (!word) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{word.word}</h1>
      <p style={{ margin: '26px auto' }}>{`Definition: ${word.definition}`}</p>
      <button
        type="button"
        onClick={() => navigate('/word-list')}
        style={{ margin: '16px auto' }}
      >
        Back to Word Bank
      </button>
    </div>
  );
}

export default WordPage;
