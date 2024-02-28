const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const chatbot = require('./utils/chatbot.js');

app.post('/api/botMessage', async (req, res) => {
    const { message } = req.body;
    const { history } = req.body;
    const completion = await chatbot.botMessage(message, history);
    res.send(JSON.stringify(completion.choices[0].message.content))
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})