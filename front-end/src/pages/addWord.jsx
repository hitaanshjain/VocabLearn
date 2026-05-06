import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

function AddWord() {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!word.trim()) {
      setError('Please enter a word.');
      return;
    }
    const token = localStorage.getItem('token');

    if (!token){
      setError('Please log in first.');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/words/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          word: word.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save word.');
      }

      navigate('/word/preview', {
        state: {
          previewWord: {
            word: data.word,
            partOfSpeech: data.partOfSpeech,
            definitions: data.definitions,
          },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Add Word</h1>
      <form onSubmit={handleSubmit} className="container form-stack">
        <input
          type="text"
          placeholder="Enter a word"
          value={word}
          onChange={(event) => setWord(event.target.value)}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Looking up...' : 'Find Word'}
        </button>

        {error && <p className="inline-error">{error}</p>}
      </form>
    </div>
  );
}

export default AddWord;