import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WordList() {
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/words');
        const data = await response.json();
        setWords(data);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    fetchWords();
  }, []);

  if (words.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Word Bank</h1>
        <p>No words in your word bank just yet!</p>
        <button
          type="button"
          onClick={() => navigate('/add-word')}
          style={{ marginTop: '16px' }}
        >
          Add Word
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Word Bank</h1>

      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          maxHeight: '70vh',
          overflowY: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {words.map((wordObj) => (
          <button
            key={wordObj.id}
            type="button"
            onClick={() => navigate(`/word/${wordObj.id}`)}
          >
            {wordObj.word}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate('/add-word')}
        style={{ margin: '16px auto' }}
      >
        Add Word
      </button>
    </div>
  );
}

export default WordList;