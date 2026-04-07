<<<<<<< ours
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
=======
import { useNavigate } from 'react-router-dom';

function WordList() {
    const navigate = useNavigate();

    const savedWords = (JSON.parse(localStorage.getItem('words')) || []);
    if (savedWords.length === 0) {
        return (<h2>No words in your word bank just yet!</h2>);
    }
    else{
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>Word Bank</h1>
                <div style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        border: '1px solid #d9d9d9',
                        borderRadius: '8px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                {savedWords.map((wordObj) => (
                    <button type="button" onClick={() => navigate(`/word/${wordObj.id}`)}>{wordObj.word}</button>
                ))}
                </div>
                <button type="button" onClick={() => navigate('/add-word')} style={{margin: '16px auto'}}>Add Word</button>
            </div>
        );
    }
}

export default WordList;
>>>>>>> theirs
