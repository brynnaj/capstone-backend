require('dotenv').config();
const apiKey = process.env.apiKey
const OpenAI = require('openai')
const openai = new OpenAI({apiKey})
const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.post('/api/botMessage', async (req, res) => {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              // Will feed the AI our html code later so that it knows the functionality of our website
              content: `You are a chatbot named Kale for a loan management website. 
                        You are to answer queries that the user has. Your response must not be longer than 1 paragraph.`,
            },
            { role: "assistant", content: 'Hi there! What can I help you with today?' },
            { role: "user", content: message },
          ],
          model: "gpt-3.5-turbo-16k-0613",
          response_format: { type: "text" },
        });
      res.send(JSON.stringify(completion.choices[0].message.content))
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})