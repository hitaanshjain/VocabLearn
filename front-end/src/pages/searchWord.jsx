import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/searchWord.css';

function match(queryDefinition, savedDefinition) {
  const queryTokens = new Set(queryDefinition.toLowerCase().split(" "));
  const savedTokens = new Set(savedDefinition.toLowerCase().split(" "));

  if (queryTokens.size === 0 || savedTokens.size === 0) return 0;

  const overlap = [...queryTokens].reduce((count, token) => {
    return count + (savedTokens.has(token) ? 1 : 0);
  }, 0);

  return overlap / Math.max(queryTokens.size, savedTokens.size);
}

const SearchWord = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') || 'word');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const savedWords = JSON.parse(localStorage.getItem('words')) || [];

  const filteredWords = savedWords
    .map(w => ({ ...w, score: match(query, w.definition) }))
    .filter(w =>
      mode === 'word'
        ? w.word.toLowerCase().startsWith(query.toLowerCase())
        : w.score >= 0.2
    )
    .sort((a, b) => b.score - a.score);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/results?q=${encodeURIComponent(query)}&mode=${mode}`);
  };

  const handleGenerate = () => {
    if (savedWords.length === 0) return;
    const random = savedWords[Math.floor(Math.random() * savedWords.length)];
    navigate(`/word/${random.word}`);
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