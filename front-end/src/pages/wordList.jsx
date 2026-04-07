import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WordList() {
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchWords = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/words');
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  fetchWords();
}, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Word Bank</h1>

      {words.length === 0 ? (
        <p>No words saved yet.</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '400px',
            margin: '20px auto',
          }}
        >
          {words.map((wordObj) => (
            <button
              key={wordObj.id}
              onClick={() => navigate(`/word/${wordObj.id}`)}
            >
              {wordObj.word}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default WordList;