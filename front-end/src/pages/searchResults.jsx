import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const query = new URLSearchParams(location.search).get('q') || '';
  const mode = new URLSearchParams(location.search).get('mode') || 'word';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/search?q=${encodeURIComponent(query)}&mode=${mode}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        setError(err.message);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Search Results</h1>
      <p>Query: {query}</p>

      {error && <p>{error}</p>}

      {!error && results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '400px',
            margin: '20px auto',
          }}
        >
          {results.map((item) => (
            <Link key={item.id} to={`/word/${item.id}`}>
              {item.word} — {item.definition}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;