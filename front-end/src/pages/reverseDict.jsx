import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReverseDict() {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const savedWords = JSON.parse(localStorage.getItem('words')) || [];

  const filteredWords = savedWords.filter((wordObj) =>
    wordObj.definition.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Reverse Dictionary</h1>

      <input
        type="text"
        placeholder="Type part of a definition"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '400px',
          margin: '20px auto',
        }}
      >
        {searchText.trim() !== '' ? (
          filteredWords.length > 0 ? (
            filteredWords.map((wordObj) => (
              <button
                key={wordObj.id}
                onClick={() => navigate(`/word/${wordObj.id}`)}
              >
                {wordObj.word}
              </button>
            ))
          ) : (
            <p>No matching words found.</p>
          )
        ) : null}
      </div>
    </div>
  );
}

export default ReverseDict;
