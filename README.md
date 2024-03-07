
# Loan IQ Server

This is a Node.js server application built with Express.js. It provides a set of API endpoints for a loan evaluation system. The server uses a chatbot for some operations and interacts with a database for data persistence.

## Features

- User registration and login
- Admin login
- Loan evaluation
- Loan application and review
- Loan payment
- Fetching loan information for user and admin dashboards
- Chatbot for user queries and loan evaluation

 ### Chatbot
 The chatbot is powered by OpenAI's GPT-3 model. It is used for two main purposes:

 - User Queries: The chatbot can answer user queries about the loan application process, loan status, and other related topics. It is connected to the client application via Socket.IO, which allows for real-time communication.

 - Loan Evaluation: The chatbot can evaluate a loan application based on the user's credit score, income, income-debt ratio, expenses, loan type, loan amount, and loan length. It returns a risk level (low, medium, or high) and a reason for the decision.

Please note that you will need to obtain your own OpenAI API key and add it to a .env file in the root directory of the project. The key should be assigned to the apiKey variable.



## Run Locally

Clone the project

```bash
  git clone https://github.com/brynnaj/capstone-backend.git
```

Go to the project directory

```bash
  cd capstone-backend
```

Install dependencies

```bash
  npm i
```

Start the server

```bash
  npm run start
```

## Dependencies
- Express.js
- Cors
- MySQL
- OpenAI
- Socket.IO

Please note that this server requires a running MySQL instance for data persistence. The connection details should be specified in the database.js file.


## Contributors

- [@benjibennett12](https://www.github.com/octokatherine)
- [@TommyPhi](https://github.com/TommyPhi)
- [@clerickbarrion](https://github.com/clerickbarrion)
- [@brynnaj](https://github.com/brynnaj)


