import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Word from './models/word.js';
import User from './models/User.js';
import { lookupWord } from './api/dictApi.js';
import { handleReverseDict } from './api/llmapi.js';
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
  if (!token) {return res.status(401).json({error: 'Access denied'});}
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.log('JWT verify failed:', error.name, error.message);
    res.status(403).json({ error: 'Invalid token'});
  }
}

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
      
      // Create starter words for new user
      const starterWords = [
        { word: 'ephemeral', definitions: ['lasting for a very short time'], partOfSpeech: 'adjective', userId: user._id },
        { word: 'serendipity', definitions: ['the occurrence of events by chance in a happy or beneficial way'], partOfSpeech: 'noun', userId: user._id },
        { word: 'ubiquitous', definitions: ['present, appearing, or found everywhere'], partOfSpeech: 'adjective', userId: user._id },
        { word: 'eloquent', definitions: ['fluent or persuasive in speaking or writing'], partOfSpeech: 'adjective', userId: user._id },
        { word: 'melancholy', definitions: ['a feeling of pensive sadness'], partOfSpeech: 'noun', userId: user._id },
      ];
      await Word.insertMany(starterWords);
      
      const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
      );
      res.json({ success: true, message: 'Registration successful', token });
    } catch {
      res.status(500).json({ error: 'Registration failed' });
    }
});


app.get('/api/words', authenticateToken, async (req, res) => {
  try {
    const words = await Word.find({ userId: req.user.id });
    res.json(words);
  } catch (error) {
    console.error('GET /api/words error:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

app.get('/api/words/:id', authenticateToken, async (req, res) => {
  try {
    const word = await Word.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json(word);
  } catch {
    res.status(404).json({ error: 'Word not found' });
  }
});

app.put('/api/words/:id', authenticateToken, async (req, res) => {
  try {
    const wordId = req.params.id;
    const existing = await Word.findById(wordId);
    if (!existing) { return res.status(404).json({ error: 'Word not found' }); }
    if (existing.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { word: newWord, partOfSpeech, definitions, correctCount, totalTested } = req.body;

    if (newWord !== undefined) {existing.word = newWord;}
    if (partOfSpeech !== undefined) {existing.partOfSpeech = partOfSpeech;}
    if (definitions !== undefined) {existing.definitions = Array.isArray(definitions) ? definitions : [definitions];}
    if (correctCount !== undefined) {existing.correctCount = Number(correctCount);}
    if (totalTested !== undefined) {existing.totalTested = Number(totalTested);}

    await existing.save();
    res.json(existing);
  } catch (error) {
    console.error('PUT /api/words/:id error:', error);
    res.status(500).json({ error: 'Failed to update word' });
  }
});

app.delete('/api/words/:id', authenticateToken, async (req, res) => {
  try {
    const wordId = req.params.id;
    const existing = await Word.findById(wordId);
    if (!existing) { return res.status(404).json({ error: 'Word not found' }); }
    if (existing.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await existing.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/words/:id error:', error);
    res.status(500).json({ error: 'Failed to delete word' });
  }
});

app.post('/api/words/preview', authenticateToken, async (req, res) => {
  try {
    const { word } = req.body;
    if (!word || !word.trim()) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const result = await lookupWord(word.trim());
    if (!result) {
      return res.status(404).json({ error: 'Word not found in dictionary' });
    }

    res.json({
      word: result.word,
      partOfSpeech: result.partOfSpeech,
      definitions: result.definitions,
    });
  } catch {
    res.status(500).json({ error: 'Failed to preview word' });
  }
});

app.post('/api/words', authenticateToken, async (req, res) => {
  try {
    const { word } = req.body;

    const existingWord = await Word.findOne({
      userId: req.user.id,
      word: word.trim().toLowerCase(),
    });

    if (existingWord) {
      return res.status(400).json({ error: 'You already added this word.' });
    }

    const result = await lookupWord(word);
    if (!result) {
      return res.status(404).json({ error: 'Word not found in dictionary' });
    }
    const newWord = new Word({
      word: word.trim().toLowerCase(),
      partOfSpeech: result.partOfSpeech,
      definitions: result.definitions,
      userId: req.user.id,
    });

    await newWord.save();
    res.status(201).json(newWord);
  } catch {
    res.status(500).json({ error: 'failed to save word' });
  }
});

app.put('/api/words/:id', authenticateToken, async (req, res) => {
  try {
    const { word, definition } = req.body;

    const updatedWord = await Word.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        word: word.trim().toLowerCase(),
        definition: definition.trim(),
      },
      { new: true }
    );

    if (!updatedWord) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json(updatedWord);
  } catch {
    res.status(500).json({ error: 'Failed to update word' });
  }
});

app.delete('/api/words/:id', authenticateToken, async (req, res) => {
  try {
    const deletedWord = await Word.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedWord) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json({ message: 'Word deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete word' });
  }
});

app.get('/api/seed', async (req, res) => {
  try {
    await Word.deleteMany({});

    const seedWords = [
      { word: 'ephemeral', partOfSpeech: 'adj', definitions: ['Lasting for a very short time.'], correctCount: 0 },
      { word: 'ubiquitous', partOfSpeech: 'adj', definitions: ['Present, appearing, or found everywhere.'], correctCount: 0 },
      { word: 'pragmatic', partOfSpeech: 'adj', definitions: ['Dealing with things sensibly and realistically.'], correctCount: 0 },
      { word: 'lucid', partOfSpeech: 'adj', definitions: ['Expressed clearly; easy to understand.'], correctCount: 0 },
      { word: 'tenacious', partOfSpeech: 'adj', definitions: ['Tending to keep a firm hold of something.'], correctCount: 0 },
    ];

    const inserted = await Word.insertMany(seedWords);
    res.json(inserted);
  } catch (error) {
    console.error('GET /api/seed error:', error);
    res.status(500).json({ error: 'Failed to seed words' });
  }
});
// Search routes
app.get('/api/search', authenticateToken, async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const mode = req.query.mode || 'word';
  try {
    const words = await Word.find({ userId: req.user.id });
    const results = words.filter((item) => {
      if (mode === 'definition') {
        return (item.definitions || []).some((definition) =>
          definition.toLowerCase().includes(q)
        );
      }
      return item.word.toLowerCase().includes(q);
    });
    res.json({ query: q, mode, results });
  } catch {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/reverse-search', authenticateToken, async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q.trim()) {
    return res.status(400).json({ error: 'Query is required' });
  }
  try {
    const words = await Word.find({ userId: req.user.id }, { word: 1, _id: 0 }).lean();
    const candidates = words.map((item) => item.word);
    const result = await handleReverseDict(q, candidates);
    const response = {
      status: result?.status || 'no_match',
      title: '',
      items: [],
      suggestion: null,
    };

    if (result?.status === 'match' && result.word) {
      const escapedWord = result.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matchedWord = await Word.findOne(
        { word: new RegExp(`^${escapedWord}$`, 'i') },
        { word: 1, definitions: 1 }
      ).lean();

      if (matchedWord) {
        response.title = 'Best match found';
        response.items = [{
          id: matchedWord._id,
          word: matchedWord.word,
          subtitle: matchedWord.definitions?.[0] || 'No definition available',
        }];
      } else {
        response.title = 'Best match found';
        response.items = [{
          id: null,
          word: result.word,
          subtitle: 'Match found. No saved details available.',
        }];
      }
    } else {
      response.title = 'No direct match found';
      response.suggestion = result?.suggestion || null;
    }

    res.json(response);
  } catch {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Quiz routes
app.get('/api/quiz', authenticateToken, async (req, res) => {
  try {
    const words = await Word.find({ userId: req.user.id });
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
        question: correctWord.definitions?.[0] || 'No definition available',
        options,
        answer: correctWord.word,
      };
    });

    res.json(questions);
  } catch {
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