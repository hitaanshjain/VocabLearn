import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WordList() {
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedWords = JSON.parse(localStorage.getItem('words')) || [];
    setWords(savedWords);
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