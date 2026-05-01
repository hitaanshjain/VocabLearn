import esmock from 'esmock';
import User from '../models/User.js';
import Word from '../models/word.js';

const { default: app } = await esmock('../app.js', {
  '../api/dictApi.js': {
    lookupWord: async (word) => ({
      word: word.trim().toLowerCase(),
      partOfSpeech: 'noun',
      definitions: [`${word.trim().toLowerCase()} definition`],
      correctCount: 0,
      totalTested: 0,
    }),
  },
  '../api/llmapi.js': {
    generatePOS: async () => 'noun',
    handleReverseDict: async (query, candidates = []) => {
      const lowerQuery = query.toLowerCase();
      const matchedWord = candidates.find((candidate) => candidate.toLowerCase().includes(lowerQuery)) || null;

      return matchedWord
        ? { status: 'match', word: matchedWord, suggestion: null }
        : { status: 'no_match', word: null, suggestion: 'word' };
    },
  },
  '../models/User.js': { default: User },
  '../models/word.js': { default: Word },
});

export { User, Word };
export default app;