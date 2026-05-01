import request from 'supertest';
import { expect } from 'chai';
import app, { User, Word } from './appTestHarness.js';

let authToken;
let userId;

before(async function() {
  const registerRes = await request(app)
    .post('/api/register')
    .send({username: 'testuser', password: 'testpass123'});
  
  authToken = registerRes.body.token;

  const user = await User.findOne({ username: 'testuser' });
  userId = user._id;
});

after(async function() {
  await Word.deleteMany({userId});
  await User.deleteOne({username: 'testuser'});
});

describe('POST /api/login', () => {
  it('should respond with status 200 and a success object', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass123' });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('success', true);
  });
});

describe('GET /api/search', () => {
  it('should respond with status 200 and matching results for a query', async () => {
    const res = await request(app)
      .get('/api/search')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ q: 'eph' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('results');
    expect(res.body.results).to.be.an('array');
    expect(res.body.results.every(item =>
      item.word.toLowerCase().includes('eph')
    )).to.equal(true);
  });

  it('should respond with status 200 and an empty array for no matches', async () => {
    const res = await request(app)
      .get('/api/search')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ q: 'gooblygooklypooklygoowly' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('results');
    expect(res.body.results).to.be.an('array');
    expect(res.body.results).to.have.lengthOf(0);
  });
});

describe('GET /api/quiz', () => {
  it('should respond with status 200 and return 4 questions', async () => {
    const res = await request(app)
      .get('/api/quiz')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(5);
  });
});

describe('POST /api/words', () => {
  it('should create a new word with definitions and store it', async() => {
    const res = await request(app)
      .post('/api/words')
      .set('Authorization', `Bearer ${authToken}`)
      .send({word: 'temporal'});
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('word', 'temporal');
    expect(res.body).to.have.property('definitions');
    expect(res.body.definitions).to.be.an('array');
    expect(res.body).to.have.property('correctCount', 0);
    expect(res.body).to.have.property('_id');
  });
});

describe('POST /api/quiz/result', () => {
  it('should accept and echo quiz score', async () => {
    const res = await request(app).post('/api/quiz/result').send({ score: 4, total: 5 });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      success: true,
      received: true,
      score: 4,
      total: 5,
    });
  });
});

describe('GET /api/reverse-search', () => {
  it('should return results matching definition text', async () => {
    const res = await request(app)
      .get('/api/reverse-search')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ q: 'm' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'match');
    expect(res.body).to.have.property('items');
    expect(res.body.items).to.be.an('array');
    expect(res.body.items).to.have.lengthOf(1);
    expect(res.body.items[0]).to.have.property('word');
  });
});