const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const database = require('./database.js')
app.use(cors());
app.use(express.json());

const chatbot = require('./utils/chatbot.js');

chatbot.connectChat(app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}));

app.post('/api/botMessage', async (req, res) => {
    const { message, history } = req.body;
    const completion = await chatbot.botMessage(message, history);
    res.send(JSON.stringify(completion.choices[0].message.content))
})

app.post('/api/evaluateLoan', async (req, res) => {
    const { UserID, creditScore, income, incomeDebtRatio, expenses, loanType, loanAmount, loanLength } = req.body;
    if (!creditScore || !income || !incomeDebtRatio || !expenses || !loanType || !loanAmount || !loanLength) {
        res.status(400).write(JSON.stringify({
                errorKey: 400,
                error: 'Missing parameter'
            }));
        res.end()
    }
    try{
        const completion = await chatbot.evaluateLoan(creditScore, income, incomeDebtRatio, expenses, loanType, loanAmount, loanLength);
        const response = completion.choices[0].message.content.split('|||');
        const insertQuery = 'INSERT INTO evaluate (UserID, creditScore, income, incomeDebtRatio, expenses, loanType, loanAmount, loanLength, riskLevel, reason) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)';
        database.query(insertQuery, [UserID ,creditScore, income, incomeDebtRatio, expenses, loanType, loanAmount, loanLength, response[0].trim(), response[1].trim()], (err) => {
            if (err) {
                res.status(500).write(JSON.stringify(
                    {
                        errorKey: 500,
                        error: err
                    }
                ));
                res.end()
                throw err;
            }
        });
        res.status(200).write(
            JSON.stringify({
                riskLevel: response[0].trim(), 
                reason: response[1].trim()
            }))
        res.end()
    } catch {
        res.status(500).write(JSON.stringify(
            {
                errorKey: 500,
                error: 'Internal server error'
            }
        ));
        res.end()
    }
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

  // query that checks if email already exists in the database
  const selectQuery = 'SELECT * FROM Users WHERE emailaddress = ?';
  database.query(selectQuery, [emailaddress], (err, result) => {
    if (err) {
      res.status(500).write('Error registering user');
      throw err;
      res.end()
    }
    if (result.length > 0) {
      res.status(400).write(JSON.stringify({ error: 'Email already exists' }));

      res.end()
    }
  });
  
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
      res.status(200).write(JSON.stringify(result));
      res.end()
    }
  });
});

app.post('/adminsignin', (req, res) => {
  const userid = req.body.userid;
  const password = req.body.password;
  const usertype = 'admin';

  // checks if any of the fields are empty
  if (!userid || !password) {
    res.status(400).json({ message: 'Please enter all fields' });
    return;
  } 
  // query that selects data from the database
  const selectQuery = 'SELECT * FROM Users WHERE userid = ? AND password = ? AND usertype = ?';
  database.query(selectQuery, [userid, password, usertype], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error logging in' });
      throw err;
    }
    if (result.length === 0) {
      res.status(400).json({ message: 'Invalid userid or password' });
    } else {
      res.status(200).json({ message: 'Login successful' });
    }
  });
});

//endpoint to insert loans into the database
app.post('/loans', (req, res) => {
  const loanid = req.body.loanid;
  const userid = req.body.userid;
  const loan_amount = req.body.loan_amount;
  const loan_term = req.body.loan_term;
  const amount_paid = req.body.amount_paid;
  
  //query that inserts data into the database
  const insertQuery = 'INSERT INTO Loans (loanid, userid, loan_amount, loan_term, amount_paid) VALUES (?, ?, ?, ?, ?)';
  database.query(insertQuery, [loanid, userid, loan_amount, loan_term, amount_paid], (err) => {
    if (err) {
      res.status(500).write('Error inserting loan');
      throw err;
      res.end()
    }
    res.status(200).write(JSON.stringify('Loan inserted successfully'));
    res.end()
  });
});


/////////////
// user dashboard
/////////////

//endpoint to fetch loans to display on dashboard
app.post('/loaninfo', (req, res) => {
    const { UserID } = req.body
    console.log()
  let query = 'SELECT s.LoanStatus, e.loanType, e.loanAmount, e.loanLength FROM status s JOIN evaluate e ON s.EvaluationID = e.EvaluationID WHERE s.UserID = ?';
    database.query(query, [UserID], (err, result) => {
        if (err) {
        res.status(500).write('Error fetching loans');
        throw err;
        res.end()
        }
        res.status(200).write(JSON.stringify(result));
        res.end()
    });
}
);


/////////////
// admin dashboard
/////////////

app.post('/adminDashboard', (req, res) => {})

/////////////
// admin review
/////////////

app.post('/reviewLoan', (req, res) => {
  const query = 'SELECT e.* FROM evaluate e JOIN status s ON e.EvaluationID = s.EvaluationID WHERE s.LoanStatus = ?';
    database.query(query, ['Under Review'], (err, result) => {
        if (err) {
            res.status(500).write('Error fetching loans');
            throw err;
        }
        res.status(200).write(JSON.stringify(result));
        res.end()
    });
})

app.post('/updateLoan', (req, res) => {
    const { EvaluationID, LoanStatus } = req.body;
    let query = 'UPDATE status SET LoanStatus = ? WHERE EvaluationID = ?';
    database.query(query, [LoanStatus, EvaluationID], (err) => {
        if (err) {
            res.status(500).write('Error updating loan');
            throw err;
        }
        
    });
    if (LoanStatus === 'Approved') {
        query = 'SELECT * FROM evaluate WHERE EvaluationID = ?';
        database.query(query, [EvaluationID], (err, result) => {
            if (err) {
                res.status(500).write('Error fetching loans');
                throw err;
            }
            console.log(result[0])
            query = 'INSERT INTO Loans (userid, loan_amount, loan_term, amount_paid, loan_type) VALUES (?,?,?,?,?)';
            database.query(query, [result[0].UserID, result[0].loanAmount, result[0].loanLength, 0,result[0].loanType], (err) => {
                if (err) {
                    res.status(500).write('Error inserting loan');
                    throw err;
                }
            });
        });
    }
    res.status(200).write(JSON.stringify('Loan updated successfully'));
    res.end()
})



app.post('/getLoans', (req, res) => {
    const { UserID } = req.body
   
    let query = 'SELECT * FROM Loans WHERE UserID = ?';
    database.query(query, [UserID], (err, result) => {
        if (err) {
            res.status(500).write('Error fetching loans');
            throw err;
        }
        res.status(200).write(JSON.stringify(result));
        res.end()
    });
})

app.post('/makePayment', (req, res) => {
    const { LoanID, AmountPaid } = req.body
    let query = 'UPDATE Loans SET amount_paid = amount_paid + ? WHERE LoanID = ?';
    database.query(query, [AmountPaid, LoanID], (err) => {
        if (err) {
            res.status(500).write('Error making payment');
            throw err;
        }
        res.status(200).write(JSON.stringify('Payment made successfully'));
        res.end()
    });
})