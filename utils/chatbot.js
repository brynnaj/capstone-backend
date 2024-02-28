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

module.exports = {
    botMessage,
}