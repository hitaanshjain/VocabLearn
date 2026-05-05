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
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://vocab-learn-api.onrender.com/api/search?q=${encodeURIComponent(query)}&mode=${mode}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        setError(err.message);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, mode]);

  return (
    <div className="page">
      <h1>Search Results</h1>
      <p className="muted">Query: {query}</p>

      {error && <p className="inline-error">{error}</p>}

      {!error && results.length === 0 ? (
        <p className="muted">No results found.</p>
      ) : (
        <div className="container list-column">
          {results.map((item) => (
            <Link key={item._id} to={`/word/${item._id}`}>
              {item.word} — {item.definitions?.[0] || 'No definition available'}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;