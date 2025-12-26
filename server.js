
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

app.use(express.json());

app.get('/ping', (req, res) => {
    res.json({ status: 'online', message: 'ElementX Local Bridge Active' });
});

app.post('/analyze', async (req, res) => {
    const { prompt, systemInstruction } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const fullPrompt = `${systemInstruction || ''}\n\nRequest: ${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No conversational text.`;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: 'llama3', 
            prompt: fullPrompt,
            stream: false,
            format: 'json'
        }, { timeout: 45000 });

        let rawData = response.data.response;
        try {
            const parsed = JSON.parse(rawData);
            res.json(parsed);
        } catch (e) {
            res.status(500).json({ error: "Invalid JSON from local AI", raw: rawData });
        }
    } catch (error) {
        console.error('Ollama Local Error:', error.message);
        res.status(503).json({ 
            error: 'Local AI (Ollama) not responding',
            details: error.message
        });
    }
});

app.post('/chemistry', async (req, res) => {
    const { question } = req.body;
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: 'llama3',
            prompt: `أنت مساعد كيميائي. أجب بالعربية: ${question}`,
            stream: false
        });
        res.json({ answer: response.data.response });
    } catch (error) {
        res.status(503).json({ error: 'Local AI Offline' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ElementX Hybrid AI Bridge running on http://localhost:${PORT}`);
});
