const chai = require('chai');
const request = require('supertest');
const app = require('../app');

const expect = chai.expect;

describe('POST /api/login', () => {
  it('should respond with status 200 and a success object', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('success', true);
  });
});

describe('GET /api/search', () => {
  it('should respond with status 200 and matching results for a query', async () => {
    const res = await request(app)
      .get('/api/search')
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
      .query({ q: 'gooblygooklypooklygoowly' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('results');
    expect(res.body.results).to.be.an('array');
    expect(res.body.results).to.have.lengthOf(0);
  });
});

describe('GET /api/quiz', () => {
  it('should respond with status 200 and return 4 questions', async () => {
    const res = await request(app).get('/api/quiz');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(5);
  });
});