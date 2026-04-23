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
      <div className="page">
        <h1>Word Bank</h1>
        <p className="muted">No words in your word bank just yet!</p>
        <button type="button" onClick={() => navigate('/add-word')}>
          Add Word
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Word Bank</h1>
      <div className="card scroll-panel list-column">
        {words.map((wordObj) => (
          <button
            key={wordObj._id}
            type="button"
            onClick={() => navigate(`/word/${wordObj._id}`)}
          >
            {wordObj.word}
          </button>
        ))}
      </div>

      <button type="button" onClick={() => navigate('/add-word')}>
        Add Word
      </button>
    </div>
  );
}

export default WordList;