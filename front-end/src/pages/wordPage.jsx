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
            <p style={{margin: '26px auto'}}>{selectedWord.definition}</p>
            <button type="button" onClick={() => navigate('/word-list')} style={{margin: 'auto'}}>Back to Word Bank</button>
        </div>
    );
}

export default WordPage;
