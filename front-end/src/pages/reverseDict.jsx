import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReverseDict() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (searchText.trim() === '') {
        setResults([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/reverse-search?q=${encodeURIComponent(searchText)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch reverse search results');
        }

        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error('Error fetching reverse search results:', error);
        setResults([]);
      }
    };

    fetchResults();
  }, [searchText]);

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
          results.length > 0 ? (
            results.map((wordObj) => (
              <button
                key={wordObj.id}
                type="button"
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