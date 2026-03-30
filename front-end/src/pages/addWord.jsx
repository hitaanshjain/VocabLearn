import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddWord() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!word.trim() || !definition.trim()) {
      return;
    }

    const savedWords = JSON.parse(localStorage.getItem('words')) || [];

    const newWord = {
      id: Date.now(),
      word: word.trim(),
      definition: definition.trim(),
      correctCount: 0,
    };

    savedWords.push(newWord);
    localStorage.setItem('words', JSON.stringify(savedWords));

    setWord('');
    setDefinition('');

    navigate('/word-list');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center'}}>
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
      </form>
    </div>
  );
}

export default AddWord;