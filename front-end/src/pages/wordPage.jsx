import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function WordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const previewWord = location.state?.previewWord || null;

  const [word, setWord] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (previewWord) {
      setWord(previewWord);
    }
  }, [previewWord]);

  useEffect(() => {
    if (!id) {
      return;
    }

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
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWord();
  }, [id]);

  const handleConfirmAddition = async () => {
    if (!word?.word) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('http://localhost:3000/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ word: word.word }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add word');
      }

      navigate(`/word/${data._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
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
      {previewWord && <p className="muted">Preview only. Confirm to add this word to your bank.</p>}
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
      <div className="word-actions">
        {previewWord && (
          <button type="button" onClick={handleConfirmAddition} disabled={isSaving}>
            {isSaving ? 'Adding...' : 'Confirm Addition'}
          </button>
        )}
        <button type="button" onClick={() => navigate('/word-list')}>
          Back to Word Bank
        </button>
      </div>
      <button type="button" onClick={() => navigate(`/word/${id}/edit`)} style={{ marginLeft: '8px' }}>
        Edit
      </button>
    </div>
  );
}

export default WordPage;