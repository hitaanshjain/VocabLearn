const express = require('express');
const cors = require('cors');

const app = express();
<<<<<<< ours
const PORT = 3001;

app.use(cors());
app.use(express.json());

const mockWords = [
  { id: 1, word: 'apple', definition: 'a fruit' },
  { id: 2, word: 'computer', definition: 'an electronic device' },
  { id: 3, word: 'algorithm', definition: 'a step-by-step procedure' },
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
=======
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  res.json({ success: true, username });
});

app.get('/', (req, res) => {
  res.redirect('http://localhost:5173/login');
});

app.get('/api/words', (req, res) => {
  res.json([
    { id: 1, word: 'ephemeral', definition: 'Lasting for a very short time.', correctCount: 0 },
    { id: 2, word: 'ubiquitous', definition: 'Present, appearing, or found everywhere.', correctCount: 0 },
    { id: 3, word: 'pragmatic', definition: 'Dealing with things sensibly and realistically.', correctCount: 0 },
    { id: 4, word: 'lucid', definition: 'Expressed clearly; easy to understand.', correctCount: 0 },
    { id: 5, word: 'tenacious', definition: 'Tending to keep a firm hold of something.', correctCount: 0 },
  ]);
});


app.get('/api/words/:id', (req, res) => {
  res.json({ id: Number(req.params.id), word: 'ephemeral', definition: 'Lasting for a very short time.', correctCount: 0 });
});


app.post('/api/words', (req, res) => {
  const { word, definition } = req.body;
  res.status(201).json({ id: Date.now(), word, definition, correctCount: 0 });
});


app.get('/api/search', (req, res) => {
  const { q = '', mode = 'word' } = req.query;
  res.json({ query: q, mode, results: [] });
>>>>>>> theirs
});

app.get('/api/quiz', (req, res) => {
  res.json([
    {
      id: 1,
<<<<<<< ours
      question: 'What does "apple" mean?',
      options: ['fruit', 'Bye', 'Goodbye', 'Thanks'],
      answer: 'fruit',
=======
      question: 'Lasting for a very short time.',
      options: ['ephemeral', 'lucid', 'tenacious', 'pragmatic'],
      answer: 'ephemeral',
>>>>>>> theirs
    },
  ]);
});

<<<<<<< ours
app.post('/api/quiz/result', (req, res) => {
  res.json({ success: true, received: req.body });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
=======

app.post('/api/quiz/result', (req, res) => {
  const { score, total } = req.body;
  res.json({ received: true, score, total });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
>>>>>>> theirs
