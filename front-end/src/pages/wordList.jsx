import { useNavigate } from 'react-router-dom';

function WordList() {
    const navigate = useNavigate();

    const savedWords = (JSON.parse(localStorage.getItem('words')) || []);
    if (savedWords.length === 0) {
        return (<h2>No words in your word bank just yet!</h2>);
    }
    else{
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>Word Bank</h1>
                <div style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        border: '1px solid #d9d9d9',
                        borderRadius: '8px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                {savedWords.map((wordObj) => (
                    <button type="button" onClick={() => navigate(`/word/${wordObj.id}`)}>{wordObj.word}</button>
                ))}
                </div>
                <button type="button" onClick={() => navigate('/add-word')} style={{margin: '16px auto'}}>Add Word</button>
            </div>
        );
    }
}

export default WordList;
