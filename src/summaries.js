import express from 'express';
import { getSummary } from './services/openai.js';

const router = express.Router();

const chunkify = (content) => {
  const chunks = content.split('\n').map((chunk) => chunk.trim());
  return chunks;
};

const processText = async (content) => {
  const chunks = chunkify(content);
  const summaries = await Promise.all(chunks.map((chunk) => getSummary(chunk)));
  const tuples = chunks.map((chunk, index) => [chunk, summaries[index]]);
  return tuples;
};

router.post('/', async (req, res) => {
  try {
    const summarized = await processText(req.body.content);
    res.json(summarized);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

export default router;