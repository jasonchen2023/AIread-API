/* eslint-disable no-unused-vars */
import { Router } from 'express';
import { auth } from './firebase';
import { processText, processChat } from './services/openai';

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
    const summarized = await processText(req.body.content);
    res.status(200).json(summarized);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

// chat
router.post('/chat', async (req, res) => {
  try {
    const response = await processChat(req.body.content);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

export default router;
