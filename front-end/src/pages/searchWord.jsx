import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/searchWord.css';

const SearchWord = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') || 'word');
  const [query, setQuery] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setFilteredWords([]);
        return;
      }

      const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}&mode=${mode}`);
      const data = await res.json();
      setFilteredWords(data.results || []);
    };

    fetchResults();
  }, [query, mode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }
    navigate(`/results?q=${encodeURIComponent(query)}&mode=${mode}`);
  };

  return (
    <div className="search-page">
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

      {query && (
        <div className="search-results">
          {filteredWords.length > 0 ? (
            filteredWords.map((w, i) => (
              <div
                key={i}
                className="search-result-item"
                onClick={() => navigate(`/results?q=${encodeURIComponent(w.word)}&mode=word`)}
              >
                <strong>{w.word}</strong>
                <span>{w.definition}</span>
              </div>
            ))
          ) : (
            <p className="no-results">No words found</p>
          )}
        </div>
      )}

  
    </div>
  );
};

export default SearchWord;