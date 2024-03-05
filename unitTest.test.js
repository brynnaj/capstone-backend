const request = require('supertest');
const app = require('./app');

// describe('POST /api/botMessage', () => {
//   it('should respond with a bot message', async () => {
//     const res = await request(app)
//       .post('/api/botMessage')
//       .send({ message: 'Hello', history: [] });
//     expect(res.statusCode).toEqual(200);
//     expect(typeof res.body).toBe('object');
//   });
// });

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

describe('POST /newuser', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/newuser')
        .send({
          firstname: 'John',
          lastname: 'Doe',
          emailaddress: 'john.doe@example.com',
          password: 'password',
          confirmpassword: 'password'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('User registered successfully');
    });
  });
