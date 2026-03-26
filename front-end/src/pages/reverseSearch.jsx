import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function match(queryDefinition, savedDefinition) {
    const queryTokens = new Set(queryDefinition.toLowerCase().split(" "));
    const savedTokens = new Set(savedDefinition.toLowerCase().split(" "));

    if (queryTokens.size === 0 || savedTokens.size === 0) {
        return 0;
    }

    const overlap = [...queryTokens].reduce((count, token) => {
        return count + (savedTokens.has(token) ? 1 : 0);
    }, 0);

    return overlap / Math.max(queryTokens.size, savedTokens.size);
}

function ReverseSearch() {
    const [definitionInput, setDefinitionInput] = useState('');
    const [searched, setSearched] = useState(false);
    const [bestMatch, setBestMatch] = useState(null);
    const navigate = useNavigate();

    const savedWords = JSON.parse(localStorage.getItem('words')) || [];

    const handleSubmit = (event) => {
        event.preventDefault();

        const def = definitionInput.trim();
        if (!def) {
            setSearched(true);
            setBestMatch(null);
            return;
        }

        let currentBest = null;
        for (const item of savedWords) {
            const score = match(def, item.definition);
            if (!currentBest || score > currentBest.score) {
                currentBest = {...item, score};
            }
        }

        if (currentBest && currentBest.score >= 0.2) {
            setBestMatch(currentBest);
        } else {
            setBestMatch(null);
        }
        setSearched(true);
    };

    return (
        <div style={{padding: '40px', textAlign: 'center'}}>
            <h1>Reverse Dictionary</h1>

            <form onSubmit={handleSubmit}
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    maxWidth: '500px',
                    margin: '20px auto',
                    }}>
                <textarea placeholder="Describe the word" value={definitionInput} onChange={(event) => setDefinitionInput(event.target.value)}/>
                <button type="submit">Find Word</button>
            </form>

            {searched && !bestMatch && (<p>No close match found. Try a longer or more specific definition.</p>)}

            {bestMatch && (
                <div>
                    <h2>Best Match: {bestMatch.word}</h2>
                    <p style={{margin: '20px auto'}}>{bestMatch.definition}</p>
                    <button type="button" onClick={() => navigate(`/word/${bestMatch.id}`)} style={{margin: '0 auto'}}>Open Word Page</button>
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                <button type="button" onClick={() => navigate('/word-list')} style={{margin: '0 auto'}}>Back to Word Bank</button>
            </div>
        </div>
        );
}

export default ReverseSearch;
