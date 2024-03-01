const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const database = require('./database.js')
app.use(cors());
app.use(express.json());

const chatbot = require('./utils/chatbot.js');

app.post('/api/botMessage', async (req, res) => {
    const { message, history } = req.body;
    const completion = await chatbot.botMessage(message, history);
    res.send(JSON.stringify(completion.choices[0].message.content))
})

app.post('/api/evaluateLoan', async (req, res) => {
    const { creditScore, income, incomeDebtRatio, expenses, loanType, loanAmount, loanLength } = req.body;
    const completion = await chatbot.evaluateLoan(creditScore, income, incomeDebtRatio, expenses, loanType, loanAmount, loanLength);
    const response = completion.choices[0].message.content.split('|||');
    res.send(
        JSON.stringify({
            riskLevel: response[0].trim(),
            reason: response[1].trim()
        }))
})

//creates new user
app.post('/newuser', (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const emailaddress = req.body.emailaddress;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  console.log(req.body)
  // checks if any of the fields are empty
  if (!firstname || !lastname || !emailaddress || !password) {
    res.status(400).write('Please enter all fields');
    res.end()
  }

  //check if passwords and confirm password match
  if (password !== confirmpassword) {
    res.status(400).write('Passwords do not match');
    res.end()
  }
  
  // query that inserts data into the database
  const insertQuery = 'INSERT INTO Users (firstname, lastname, emailaddress, password) VALUES (?, ?, ?, ?)';
  database.query(insertQuery, [firstname, lastname, emailaddress, password], (err) => {
    if (err) {
      res.status(500).write('Error registering user');
      throw err;
      res.end()
    }
    res.status(200).write(JSON.stringify('User registered successfully'));
    res.end()
  });
});

//login functionality
app.post('/signin', (req, res) => {
  const emailaddress = req.body.emailaddress;
  const password = req.body.password;

  // checks if any of the fields are empty  
  if (!emailaddress || !password) {
    res.status(400).write('Please enter all fields');
    res.end()
  } 
  // query that selects data from the database
  const selectQuery = 'SELECT * FROM Users WHERE emailaddress = ? AND password = ?';
  database.query(selectQuery, [emailaddress, password], (err, result) => {
    if (err) {
      res.status(500).write('Error logging in');
      throw err;
      res.end()
    }
    if (result.length === 0) {
      res.status(400).write('Invalid email or password');
      res.end()
    } else {
      res.status(200).write(JSON.stringify('Login successful'));
      res.end()
    }
  });
});
  



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})