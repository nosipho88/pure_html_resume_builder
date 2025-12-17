// Firebase Cloud Functions sample (Node.js) to proxy OpenAI calls securely.
// Deploy this with `firebase deploy --only functions` after setting OPENAI_API_KEY in Functions environment.
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post('/generate-summary', async (req, res) => {
  const { name, skills, experiences } = req.body || {};
  const prompt = `Write a 2-3 sentence professional resume summary for ${name}. Skills: ${skills.join(', ')}. Recent roles: ${experiences.slice(0,3).map(e=>e.title).join(', ')}`;
  try {
    const key = process.env.OPENAI_API_KEY;
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {'Content-Type':'application/json','Authorization':'Bearer ' + key},
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.2
      })
    });
    const json = await resp.json();
    const summary = json?.choices?.[0]?.message?.content || '';
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

exports.api = functions.https.onRequest(app);
