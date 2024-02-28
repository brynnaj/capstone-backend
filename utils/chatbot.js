require('dotenv').config();
const apiKey = process.env.apiKey
const OpenAI = require('openai')
const openai = new OpenAI({apiKey})

async function botMessage(message, history){
    const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            // Will feed the AI our html code later so that it knows the functionality of our website
            content: `You are a chatbot named Kale for a loan management website. 
                      You are to answer queries that the user has. Your response must not be longer than 1 paragraph.
                      Here is the conversation so far ||| ${history} |||`,
          },
          { role: "user", content: message },
        ],
        model: "gpt-3.5-turbo-16k-0613",
        response_format: { type: "text" },
    });
    return completion
}

async function evaluateLoan(creditScore, income, incomeDebtRatio, expenses, loanType, loanAmount, loanLength){
    const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a loan evaluator. The user will enter in their information and you will make a risk assessment based on the information given.
                      Here is the user's information: ||| Credit Score: ${creditScore} ||| Income: ${income} ||| Income Debt Ratio: ${incomeDebtRatio} ||| Expenses: ${expenses} ||| Loan Type: ${loanType} ||| Loan Amount: ${loanAmount} ||| Loan Length: ${loanLength} |||
                      In your response you must have a risk level of low, medium, or high. You must also have a reason for your decision.
                      Format your response like this: 
                      Low ||| Your reason here.`,
          },
          { role: "user", content: "Make the assessment" },
        ],
        model: "gpt-3.5-turbo-16k-0613",
        response_format: { type: "text" },
    });
    return completion
}

module.exports = {
    botMessage,
    evaluateLoan,
}