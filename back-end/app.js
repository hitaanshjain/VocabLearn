const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const mockWords = [
  { id: 1, word: 'Hello', definition: 'greeting' },
  { id: 2, word: 'professor', definition: 'teacher' },
  { id: 3, word: 'white', definition: 'color' },
];

app.post('/api/login', (req, res) => {
  res.json({ success: true, message: 'Mock login successful' });
});

app.post('/api/register', (req, res) => {
  res.json({ success: true, message: 'Mock registration successful' });
});

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
  const newWord = {
    id: mockWords.length + 1,
    ...req.body,
  };

  mockWords.push(newWord);
  res.status(201).json(newWord);
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();

  const results = mockWords.filter(
    (item) =>
      item.word.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q)
  );

  res.json({ results });
});

app.get('/api/reverse-search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();

  const results = mockWords.filter((item) =>
    item.definition.toLowerCase().includes(q)
  );

  res.json({ results });
});

app.get('/api/quiz', (req, res) => {
  res.json([
    {
      id: 1,
      question: 'What does "hello" mean?',
      options: ['Greeting', 'Bye', 'Goodbye', 'Thanks'],
      answer: 'Peace',
    },
  ]);
});

app.post('/api/quiz/result', (req, res) => {
  res.json({ success: true, received: req.body });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});