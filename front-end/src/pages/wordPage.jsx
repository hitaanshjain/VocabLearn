<<<<<<< ours
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
=======
import { useNavigate, useParams } from 'react-router-dom';

function WordPage() {
    const navigate = useNavigate();
    const {id} = useParams();

    if (String(id) === "notinbank") {
        return (
        <div>
            <h1>Word Not Found</h1>
            <p>This word may have been removed from your local word bank.</p>
            <button type="button" onClick={() => navigate('/word-list')} style={{margin: 'auto'}}>Back to Word Bank</button>
        </div>
        );
    }

    const savedWords = (JSON.parse(localStorage.getItem('words')) || []);
    const selectedWord = savedWords.find((item) => String(item.id) === String(id));

    return (
        <div>
            <h1>{selectedWord.word}</h1>
            <p style={{margin: '26px auto'}}>{"Definition: " + selectedWord.definition}</p>
            <button type="button" onClick={() => navigate('/word-list')} style={{margin: 'auto'}}>Back to Word Bank</button>
        </div>
    );
}

export default WordPage;
>>>>>>> theirs
