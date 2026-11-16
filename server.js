const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Model name ko gemini-1.5-flash rakha hai
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const replyText = data.candidates[0].content.parts[0].text;
            res.json({ reply: replyText });
        } else if (data.error) {
            res.json({ reply: `⚠️ API Error: ${data.error.message}` });
        } else {
            res.json({ reply: "⚠️ Gemini API returned empty structure. Check API Key." });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`UK Tech AI Server is running on port ${PORT}`));