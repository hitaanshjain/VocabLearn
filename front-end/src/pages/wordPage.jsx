import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function WordPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [word, setWord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/words/${id}`);

        if (!response.ok) {
          throw new Error('Word not found');
        }

        const data = await response.json();
        setWord(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWord();
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <h1>Word Not Found</h1>
        <p className="inline-error">{error}</p>
        <button type="button" onClick={() => navigate('/word-list')}>
          Back to Word Bank
        </button>
      </div>
    );
  }

  if (!word) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page">
      <h1>{word.word}</h1>
      <p>{`Part of speech: ${word.partOfSpeech ?? 'unknown'}`}</p>
          {Array.isArray(word.definitions) && word.definitions.length > 0 ? (
            <ol className="definition-list">
              {word.definitions.map((definition, index) => (
                <li key={index}>{definition}</li>
              ))}
            </ol>
          ) : (
            <p>No definitions available.</p>
          )}
      <button type="button" onClick={() => navigate('/word-list')}>
        Back to Word Bank
      </button>
    </div>
  );
}

export default WordPage;