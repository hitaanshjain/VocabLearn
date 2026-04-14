const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('POST /api/login', () => {
  it('it should respond with an HTTP 200 status code and an object in the response body', done => {
    chai.request(app)
      .post('/api/login')
      .send({username: 'testuser', password: 'testpass'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success', true);
        done();
      });
  });
});

describe('GET /api/search', () => {
  it('it should respond with an HTTP 200 status code and an array of matching results when querying by word in the response body', done => {
    chai.request(app)
      .get('/api/search')
      .query({q: 'eph'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('results');
        res.body.results.every(item => item.word.toLowerCase().includes('eph')).should.equal(true);
        done();
      });
  });

  it('it should respond with an HTTP 200 status code and an empty array in the response body', done => {
    chai.request(app)
      .get('/api/search')
      .query({q: 'gooblygooklypooklygoowly'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('results');
        res.body.results.should.have.lengthOf(0);
        done();
      });
  });
});

describe('GET /api/quiz', () => {
  it('it should respond with an HTTP 200 status code and return an array of 4 questions in the response body', done => {
    chai.request(app)
      .get('/api/quiz')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.lengthOf(4);
        done();
      });
  });
});