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
            'Authorization': `Bearer ${token}`
          }
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
      <div className="page">
        <h1>Word Not Found</h1>
        <p className="inline-error">{error}</p>
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
    <div className="page">
      <h1>{word.word}</h1>
      <p>{`Part of speech: ${word.partOfSpeech ?? 'unknown'}`}</p>
          {Array.isArray(word.definitions) && word.definitions.length > 0 ? (
            <ol className="definition-list">
              {word.definitions.map((definition, index) => (
                <li key={index}>{definition}</li>
              ))}
            </ol>
          ) : (
            <p>No definitions available.</p>
          )}
      <button type="button" onClick={() => navigate('/word-list')}>
        Back to Word Bank
      </button>
      <button type="button" onClick={() => navigate(`/word/${id}/edit`)} style={{ marginLeft: '8px' }}>
        Edit
      </button>
    </div>
  );
}

export default WordPage;