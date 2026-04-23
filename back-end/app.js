import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Word from './models/Word.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.use(express.json());
app.use(cors());

function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({error: 'Access denied'});
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (_error) {
    res.status(403).json({ error: 'Invalid token'});
  }
}

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
app.post('/api/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const user = await User.findOne({username: req.body.username});
    if (!user){return res.status(401).json({error: 'Invalid username'});}
    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass){return res.status(401).json({error: 'Invalid password'});}
    const token = jwt.sign(
      {id: user._id, username: user.username},
      process.env.JWT_SECRET,
      {expiresIn: '24h'}
    );
    res.json({success: true, token});
  }
);

app.post('/api/register', 
  [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({max: 50}).withMessage('Username must be 50 characters or fewer'),
    body('password').trim().notEmpty().withMessage('Password is required').isLength({min: 8, max: 50}).withMessage('Password must be 8 or more characters and 50 or fewer'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const existing = await User.findOne({ username: req.body.username });
      if (existing) {return res.status(409).json({ error: 'Username already taken' });}
      const user = new User({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 12),
      });
      await user.save();
      res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
});


app.get('/api/words', async (req, res) => {
  try {
    const words = await Word.find();
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

app.get('/api/words/:id', async (req, res) => {
  try {
    const wordId = req.params.id;
    const word = await Word.findById(wordId);
    if (!word) {return res.status(404).json({ error: 'Word not found' });}
    res.json(word);
  } catch (error) {
    res.status(404).json({ error: 'Word not found' });
  }
});

app.post('/api/words', authenticateToken, async (req, res) => {
  try {
    const { word, definition } = req.body;

    const newWord = new Word({
      word,
      definition,
    });

    await newWord.save();
    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ error: 'failed to save word' });
  }
});

app.get('/api/seed', async (req, res) => {
  try {
    await Word.deleteMany({});

    const seedWords = [
      { word: 'ephemeral', definition: 'Lasting for a very short time.', correctCount: 0 },
      { word: 'ubiquitous', definition: 'Present, appearing, or found everywhere.', correctCount: 0 },
      { word: 'pragmatic', definition: 'Dealing with things sensibly and realistically.', correctCount: 0 },
      { word: 'lucid', definition: 'Expressed clearly; easy to understand.', correctCount: 0 },
      { word: 'tenacious', definition: 'Tending to keep a firm hold of something.', correctCount: 0 },
    ];

    const inserted = await Word.insertMany(seedWords);
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed words' });
  }
});
// Search routes
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const mode = req.query.mode || 'word';
  try {
    const words = await Word.find();
    const results = words.filter((item) => {
      if (mode === 'definition') {
        return item.definition.toLowerCase().includes(q);
      }
      return item.word.toLowerCase().includes(q);
    });
    res.json({ query: q, mode, results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/reverse-search', async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  try {
    const words = await Word.find();
    const results = words.filter((item) =>
      item.definition.toLowerCase().includes(q)
    );
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Quiz routes
app.get('/api/quiz', async (req, res) => {
  try {
    const words = await Word.find();
    if (words.length < 5) {
      return res.status(400).json({ error: 'Not enough words for quiz' });
    }

    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const questionWords = shuffled.slice(0, 5);

    const questions = questionWords.map((correctWord) => {
      const otherWords = words
        .filter((item) => item.word !== correctWord.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((item) => item.word);

      const options = [...otherWords, correctWord.word].sort(() => 0.5 - Math.random());
      return {
        id: correctWord._id,
        question: correctWord.definition,
        options,
        answer: correctWord.word,
      };
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

app.post('/api/quiz/result', (req, res) => {
  const { score, total } = req.body;
  res.json({ success: true, received: true, score, total });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;