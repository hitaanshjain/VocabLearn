import request from 'supertest';
import { expect } from 'chai';
import app, { User, Word } from './appTestHarness.js';

let authToken;
let userId;

before(async function() {
  const registerRes = await request(app)
    .post('/api/register')
    .send({username: 'quiztestuser', password: 'testpass123'});
  
  authToken = registerRes.body.token;
  
  // Get userId from database
  const user = await User.findOne({ username: 'quiztestuser' });
  userId = user._id;
});

after(async function() {
  await Word.deleteMany({userId});
  await User.deleteOne({username: 'quiztestuser'});
});

describe('Quiz routes', () => {
  let quizQuestions = [];

  before(async () => {
    const quizRes = await request(app)
      .get('/api/quiz')
      .set('Authorization', `Bearer ${authToken}`);
    quizQuestions = quizRes.body;
  });

  it('GET /api/quiz should return 5 quiz questions', async () => {
    const res = await request(app)
      .get('/api/quiz')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(5);

    res.body.forEach((question) => {
      expect(question).to.have.property('id');
      expect(question).to.have.property('question');
      expect(question).to.have.property('options');
      expect(question).to.have.property('answer');

      expect(question.options).to.be.an('array');
      expect(question.options.length).to.equal(4);
      expect(question.options).to.include(question.answer);
    });
  });

  it('POST /api/quiz/result should persist per-word quiz stats', async () => {
    const payload = {
      answers: quizQuestions.map((question, index) => ({
        wordId: question.id,
        isCorrect: index % 2 === 0,
      })),
    };

    const res = await request(app)
      .post('/api/quiz/result')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('received', payload.answers.length);
    expect(res.body).to.have.property('updated');

    const updatedWord = await Word.findById(payload.answers[0].wordId);
    expect(updatedWord.totalTested).to.equal(1);
    expect(updatedWord.correctCount).to.equal(1);
  });
});