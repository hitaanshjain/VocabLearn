import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/searchWord.css';

const SearchWord = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') || 'word');
  const [query, setQuery] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);
  const [reverseResult, setReverseResult] = useState(null);
  const [isReverseLoading, setIsReverseLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (mode !== 'word') {
        setFilteredWords([]);
        return;
      }

      if (!query.trim()) {
        setFilteredWords([]);
        return;
      }


        const token = localStorage.getItem('token');
      const res = await fetch(`https://vocab-learn-api.onrender.com/api/search?q=${encodeURIComponent(query)}&mode=${mode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setFilteredWords(data.results || []);
    };

    fetchResults();
  }, [query, mode]);

  useEffect(() => {
    setError('');
    setReverseResult(null);
    if (mode !== 'word') {
      setFilteredWords([]);
    }
  }, [mode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }

    setError('');

    if (mode === 'word') {
      return;
    }

    try {
      setIsReverseLoading(true);
      const token = localStorage.getItem('token');
      const reverseRes = await fetch(`https://vocab-learn-api.onrender.com/api/reverse-search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reverseData = await reverseRes.json();
      if (!reverseRes.ok) {
        throw new Error(reverseData.error || 'Reverse search failed');
      }
      setReverseResult(reverseData || null);
    } catch (err) {
      setError(err.message || 'Reverse search failed');
    } finally {
      setIsReverseLoading(false);
    }
  };

  return (
    <div className="page search-page">
      <h1>{mode === 'word' ? 'Search For a Word' : 'Find a Word by Definition'}</h1>

      <div className="toggle-container">
        <button
          className={`toggle-btn ${mode === 'word' ? 'toggle-active' : ''}`}
          onClick={() => setMode('word')}
        >
          Word
        </button>
        <button
          className={`toggle-btn ${mode === 'definition' ? 'toggle-active' : ''}`}
          onClick={() => setMode('definition')}
        >
          Definition
        </button>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder={mode === 'word' ? 'Enter a word...' : 'Describe a definition...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input type="submit" value="Search"/>
      </form>

      {error && <p className="inline-error reverse-message">{error}</p>}

      {mode === 'word' && query && (
        <div className="search-results">
          {filteredWords.length > 0 ? (
            filteredWords.map((w, i) => (
              <div
                key={i}
                className="search-result-item"
                onClick={() => navigate(`/word/${w._id}`)}
              >
                <strong>{w.word}</strong>
                <span>{w.definitions?.[0] || 'No definition available'}</span>
              </div>
            ))
          ) : (
            <p className="no-results">No words found</p>
          )}
        </div>
      )}

      {mode === 'definition' && isReverseLoading && (
        <p className="muted reverse-message">Searching with AI...</p>
      )}

      {mode === 'definition' && reverseResult && (
        <div className="search-results">
          {reverseResult.status === 'match' ? (
            <div
              className="search-result-item"
              onClick={() => reverseResult.items?.[0]?.id && navigate(`/word/${reverseResult.items[0].id}`)}
            >
              <strong>{reverseResult.items?.[0]?.word || 'Matched word'}</strong>
              <span>
                {reverseResult.items?.[0]?.subtitle || 'Match found. Open word details if available.'}
              </span>
            </div>
          ) : (
            <p className="no-results">
              {reverseResult.title || 'No direct match found'}.
              {reverseResult.suggestion && (
                <> Suggested word: <strong>{reverseResult.suggestion}</strong></>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWord;