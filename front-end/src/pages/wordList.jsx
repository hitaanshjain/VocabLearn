import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/searchWord.css';
function WordList() {
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this word?')) {return;}
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://vocab-learn-api.onrender.com/api/words/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setWords((prev) => prev.filter((w) => w._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete word');
      }
    } catch (err) {
      console.error('Error deleting word:', err);
      alert('Failed to delete word');
    }
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://vocab-learn-api.onrender.com/api/words', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
      <h1>Your Words</h1>
      <button type="button" onClick={() => navigate('/add-word')}>
        Add Another Word
      </button>

            <div className="search-results">
        {words.map((wordObj) => (
          <div key={wordObj._id} className="search-result-item">
            <span
              style={{ flex: 1, cursor: 'pointer', color: '#111827', fontWeight: 500 }}
              onClick={() => navigate(`/word/${wordObj._id}`)}
            >
              {wordObj.word}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(wordObj._id)}
              style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', padding: '0 6px', fontSize: '1.2rem' }}
              aria-label={`Delete ${wordObj.word}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WordList;