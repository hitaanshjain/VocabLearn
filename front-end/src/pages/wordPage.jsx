import { useNavigate, useParams } from 'react-router-dom';

function WordPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const savedWords = JSON.parse(localStorage.getItem('words')) || [];
  const selectedWord = savedWords.find((wordObj) => String(wordObj.id) === id);

  if (!selectedWord) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Word Not Found</h1>
        <button onClick={() => navigate('/word-list')}>Back to Word Bank</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{selectedWord.word}</h1>
      <p>{selectedWord.definition}</p>
      <p>Correct quiz count: {selectedWord.correctCount}</p>

      <button onClick={() => navigate('/word-list')}>Back to Word Bank</button>
    </div>
  );
}

export default WordPage;