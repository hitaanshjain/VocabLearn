import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WordList() {
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this word?')) {return;}
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/words/${id}`, {
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
        const response = await fetch('http://localhost:3000/api/words', {
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
      <h1>Word Bank</h1>
      <div className="card scroll-panel list-column">
        {words.map((wordObj) => (
          <div
            key={wordObj._id}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', padding: '4px 0' }}
          >
            <button
              type="button"
              onClick={() => navigate(`/word/${wordObj._id}`)}
              style={{ flex: 1, textAlign: 'center' }}
            >
              {wordObj.word}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(wordObj._id)}
              style={{ marginLeft: '4px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', padding: '0 6px' }}
              aria-label={`Delete ${wordObj.word}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => navigate('/add-word')}>
        Add Word
      </button>
    </div>
  );
}

export default WordList;