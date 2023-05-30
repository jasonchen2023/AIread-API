/* eslint-disable no-unused-vars */
import { Router } from 'express';
import { auth } from './firebase';
import { processText, processChunk, processChat } from './services/openai';

const router = Router();

// token auth middleware for /api routes
router.use((req, res, next) => {
  console.log('authorizing request to /api at:', new Date().toLocaleTimeString());
  const token = req.get('authorization');

  if (token) {
    auth.verifyIdToken(token)
      .then((decodedToken) => {
        console.log(`authorized user ${decodedToken.uid}`);
        next();
      })
      .catch((error) => {
        console.log('failed to authorize user');
        res.status(401).send('Invalid auth');
      });
  } else {
    console.log('failed to authorize user');
    res.status(401).send('No auth token provided');
  }
});

router.get('/', (req, res) => {
  res.status(200).json({ message: 'welcome to the airead api!' });
});

// summarize
router.post('/summaries', async (req, res) => {
  try {
    let summarized;

    if (req.body.summaryType === 'document') {
      if (!Array.isArray(req.body.content) || !req.body.content.every((doc) => { return typeof doc === 'string'; })) {
        throw new Error('documents must be an array with string elements');
      }
      summarized = await processText(req.body.content);
    } else if (req.body.summaryType === 'chunk') {
      summarized = await processChunk(req.body.content);
    } else {
      throw new Error('invalid summary type');
    }

    res.status(200).json(summarized);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// chat
router.post('/chat', async (req, res) => {
  const { content } = req.body;
  console.log(content);
  try {
    const response = await processChat(content);
    console.log(`sending response: ${response}`);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

export default router;
