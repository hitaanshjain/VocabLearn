import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddWord() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [error, setError] = useState('');
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
      const response = await fetch('http://localhost:3000/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          word: word.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save word.');
      }

      setWord('');
      setDefinition('');
      setError('');
      navigate('/word-list');
    } catch (err) {
      setError(err.message);
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

        <button type="submit">Save Word</button>

        {error && <p className="inline-error">{error}</p>}
      </form>
    </div>
  );
}

export default AddWord;