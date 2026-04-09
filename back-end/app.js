const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cors());

// Mock data
const mockWords = [
  { id: 1, word: 'ephemeral', definition: 'Lasting for a very short time.', correctCount: 0 },
  { id: 2, word: 'ubiquitous', definition: 'Present, appearing, or found everywhere.', correctCount: 0 },
  { id: 3, word: 'pragmatic', definition: 'Dealing with things sensibly and realistically.', correctCount: 0 },
  { id: 4, word: 'lucid', definition: 'Expressed clearly; easy to understand.', correctCount: 0 },
  { id: 5, word: 'tenacious', definition: 'Tending to keep a firm hold of something.', correctCount: 0 },
];

// Redirect root to frontend
app.get('/', (req, res) => {
  res.redirect(`${FRONTEND_URL}/login`);
});

// Auth routes
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  res.json({ success: true, username, message: 'Mock login successful' });
});

app.post('/api/register', (req, res) => {
  res.json({ success: true, message: 'Mock registration successful' });
});

// Words routes
app.get('/api/words', (req, res) => {
  res.json(mockWords);
});

app.get('/api/words/:id', (req, res) => {
  const wordId = Number(req.params.id);
  const word = mockWords.find((w) => w.id === wordId);

  if (!word) {
    return res.status(404).json({ error: 'Word not found' });
  }

  res.json(word);
});

app.post('/api/words', (req, res) => {
  const { word, definition } = req.body;

  const newWord = {
    id: mockWords.length + 1,
    word,
    definition,
    correctCount: 0,
  };

  mockWords.push(newWord);
  res.status(201).json(newWord);
});

// Search routes
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const mode = req.query.mode || 'word';

  const results = mockWords.filter((item) => {
    if (mode === 'definition') {
      return item.definition.toLowerCase().includes(q);
    }
    return item.word.toLowerCase().includes(q);
  });

  res.json({ query: q, mode, results });
});

app.get('/api/reverse-search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();

  const results = mockWords.filter((item) =>
    item.definition.toLowerCase().includes(q)
  );

  res.json({ results });
});

// Quiz routes
app.get('/api/quiz', (req, res) => {
  if (mockWords.length < 4) {
    return res.status(400).json({ error: 'Not enough words for quiz' });
  }

  const correctWord = mockWords[Math.floor(Math.random() * mockWords.length)];

  const otherWords = mockWords
    .filter((item) => item.word !== correctWord.word)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((item) => item.word);

  const options = [...otherWords, correctWord.word].sort(() => 0.5 - Math.random());

  res.json({
    id: correctWord.id,
    question: correctWord.definition,
    options,
    answer: correctWord.word,
  });
});

app.post('/api/quiz/result', (req, res) => {
  const { score, total } = req.body;
  res.json({ success: true, received: true, score, total });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;