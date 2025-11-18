import express from 'express';
import cors from 'cors';
import { analyzePDFAndCreateSong } from './pdf-analyze.js';

const app = express();
app.use(cors({
  origin: "http://localhost:3001",
}));


app.get('/analyze', async (req, res) => {
  try {
    const text = await analyzePDFAndCreateSong();
    res.send(text);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
