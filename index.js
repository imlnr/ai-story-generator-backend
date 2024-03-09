const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get('/story', async (req, res) => {
    try {
        const genre = req.query.genre;
        if (!genre) {
            return res.status(400).json({ error: "Genre parameter is required" });
        }

        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: `Tell me a story about "${genre}" genre.`,
            max_tokens: 200,
            temperature: 0.7, // Adjust temperature for more or less randomness
            stop: ['\n'] // Stop generation at new line
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        const story = response.data.choices[0].text.trim();
        res.json({ genre, story });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(8080, () => {
    console.log("Server is running at port 8080");
});
