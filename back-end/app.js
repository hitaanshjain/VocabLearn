const express = require('express');
const cors = require('cors');

const app = express();
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
});

app.get('/api/quiz', (req, res) => {
  res.json([
    {
      id: 1,
      question: 'Lasting for a very short time.',
      options: ['ephemeral', 'lucid', 'tenacious', 'pragmatic'],
      answer: 'ephemeral',
    },
  ]);
});


app.post('/api/quiz/result', (req, res) => {
  const { score, total } = req.body;
  res.json({ received: true, score, total });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
