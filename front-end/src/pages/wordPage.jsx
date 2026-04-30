import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function WordPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [word, setWord] = useState(null);
  const [editedWord, setEditedWord] = useState('');
  const [editedDefinition, setEditedDefinition] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3000/api/words/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Word not found');
        }

        const data = await response.json();
        setWord(data);
        setEditedWord(data.word);
        setEditedDefinition(data.definition);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWord();
  }, [id]);

  const handleSave = async () => {
    if (!editedWord.trim() || !editedDefinition.trim()) {
      setError('Please enter both a word and a definition.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3000/api/words/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          word: editedWord,
          definition: editedDefinition,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update word');
      }

      const updatedWord = await response.json();
      setWord(updatedWord);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this word?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3000/api/words/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete word');
      }

      navigate('/word-list');
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !word) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Word Not Found</h1>
        <p>{error}</p>
        <button type="button" onClick={() => navigate('/word-list')}>
          Back to Word Bank
        </button>
      </div>
    );
  }

  if (!word) {
    return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</p>;
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '30px',
          border: '1px solid #ddd',
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
        }}
      >
        {!isEditing ? (
          <>
            <h1>{word.word}</h1>
            <p style={{ margin: '24px auto', fontSize: '18px' }}>
              <strong>Definition:</strong> {word.definition}
            </p>

            <p>
              <strong>Correct Count:</strong> {word.correctCount || 0}
            </p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button type="button" onClick={() => setIsEditing(true)}>
                Edit Word
              </button>

              <button type="button" onClick={handleDelete}>
                Delete Word
              </button>

              <button type="button" onClick={() => navigate('/word-list')}>
                Back
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>Edit Word</h1>

            <input
              type="text"
              value={editedWord}
              onChange={(event) => setEditedWord(event.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
            />

            <textarea
              value={editedDefinition}
              onChange={(event) => setEditedDefinition(event.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                minHeight: '100px',
                marginBottom: '12px',
              }}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button type="button" onClick={handleSave}>
                Save Changes
              </button>

              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WordPage;