const request = require('supertest');
const app = require('./app');
const chatbot = require('./utils/chatbot');



describe('POST /api/evaluateLoan', () => {
  it('should evaluate a loan', async () => {
    const res = await request(app)
      .post('/api/evaluateLoan')
      .send({
        UserID: 1,
        creditScore: 700,
        income: 50000,
        incomeDebtRatio: 0.3,
        expenses: 2000,
        loanType: 'personal',
        loanAmount: 10000,
        loanLength: 12
      });
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe('object');
  });
});

describe('POST /signin', () => {
  it('should authenticate a user', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        emailaddress: 'booboo@gmail.com',
        password: 'thefool'
      });
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe('object');
  });
});



// create test for admin login
describe('POST /adminsignin', () => {
  it('should authenticate an admin', async () => {
    const res = await request(app)
      .post('/adminsignin')
      .send({
        userid:9,
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe('object');
  });
});


describe('POST /adminsignin', () => {
  it('should not authenticate a user who is not admin', async () => {
    const res = await request(app)
      .post('/adminsignin')
      .send({
        userid:6,
        password: 'thefool'
      });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body).toBe('object');
  });
});