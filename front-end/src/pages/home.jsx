import {useNavigate} from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <h1>What would you like to do?</h1>
      <div className="button-container">
        <button onClick={() => navigate('/add-word')}>
          Add a Word
        </button>
        <button onClick={() => navigate('/quiz')}>
          Take a Vocab Quiz
        </button>
        <button onClick={() => navigate('/reverse-dict')}>
          Find A Word From The Definition
        </button>
        <button onClick={() => navigate('/word-list')}>
          View Word Bank
        </button>
      </div>
    </div>
  );
}

export default Home;