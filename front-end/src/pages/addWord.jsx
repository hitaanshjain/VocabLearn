import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddWord() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!word.trim() || !definition.trim()) {
      setError('Please enter both a word and a definition.');
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          word: word.trim(),
          definition: definition.trim(),
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
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Add Word</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '400px',
          margin: '20px auto',
        }}
      >
        <input
          type="text"
          placeholder="Enter a word"
          value={word}
          onChange={(event) => setWord(event.target.value)}
        />

        <input
          type="text"
          placeholder="Enter the definition"
          value={definition}
          onChange={(event) => setDefinition(event.target.value)}
        />

        <button type="submit">Save Word</button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default AddWord;