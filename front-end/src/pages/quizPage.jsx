import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

function QuizPage() {
  const navigate = useNavigate();

  const questions = useMemo(() => {
    const savedWords = JSON.parse(localStorage.getItem('words')) || [];

    if (savedWords.length < 4) {
      return [];
    }

    const shuffledWords = shuffleArray(savedWords);
    const chosenWords = shuffledWords.slice(0, 5);

    return chosenWords.map((wordObj) => {
      const wrongAnswers = shuffleArray(
        savedWords.filter((item) => item.word !== wordObj.word)
      )
        .slice(0, 3)
        .map((item) => item.word);

      const options = shuffleArray([wordObj.word, ...wrongAnswers]);

      return {
        id: wordObj.id || wordObj.word,
        question: wordObj.definition,
        options,
        answer: wordObj.word,
      };
    });
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (choice) => {
    const correctAnswer = questions[currentQuestion].answer;
    let newScore = score;

    if (choice === correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }

    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      navigate('/quiz-results', {
        state: {
          score: newScore,
          total: questions.length,
        },
      });
    }
  };

  if (questions.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Quiz</h1>
        <p>You need at least 4 words in your word bank first.</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Quiz</h1>
      <h2>Which word matches this definition?</h2>
      <p>{question.question}</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '300px',
          margin: '20px auto',
        }}
      >
        {question.options.map((option) => (
          <button key={option} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>
    </div>
  );
}

export default QuizPage;