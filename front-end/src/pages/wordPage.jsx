import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function WordPage() {
  const { id } = useParams();
  const [word, setWord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/words/${id}`);

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

  if (error) return <p>{error}</p>;
  if (!word) return <p>Loading...</p>;

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{word.word}</h1>
      <p>{word.definition}</p>
    </div>
  );
}

export default WordPage;