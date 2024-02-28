const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})