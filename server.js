import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = 'mistralai/Mixtral-8x7B-Instruct-v0.1'; // ✅ Use a public model that works on free tier

app.post('/explain', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();

    // If error returned from Hugging Face
    if (data.error) {
      console.error("❌ Hugging Face error:", data.error);
      return res.status(500).json({ error: data.error });
    }

    const generatedText = data[0]?.generated_text || 'No explanation generated.';
    res.json({ explanation: generatedText });

  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: 'Server failed to generate explanation' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
