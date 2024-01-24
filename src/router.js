/* eslint-disable no-unused-vars */
import { Router } from 'express';
import { auth } from './firebase';
import { processAllChunks, processChunk, processChat, getEmbedding, analyzeText } from './services/openai';
import {extractText, saveContentEmbeddings} from './services/textProcess';


const router = Router();

// token auth middleware for /api routes
// router.use((req, res, next) => {
//   console.log('authorizing request to /api at:', new Date().toLocaleTimeString());
//   const token = req.get('authorization');

//   if (token) {
//     auth.verifyIdToken(token)
//       .then((decodedToken) => {
//         console.log(`authorized user ${decodedToken.uid}`);
//         next();
//       })
//       .catch((error) => {
//         console.log('failed to authorize user');
//         res.status(401).send('Invalid auth');
//       });
//   } else {
//     console.log('failed to authorize user');
//     res.status(401).send('No auth token provided');
//   }
// });

router.get('/', (req, res) => {
  res.status(200).json({ message: 'welcome to the airead api!' });
});

// summarize
router.post('/summaries', async (req, res) => {
  try {
    let summarized;

    // "document" summarization path
    if (req.body.summaryType === 'document') {
      if (!Array.isArray(req.body.content) || !req.body.content.every((doc) => { return typeof doc === 'string'; })) {
        throw new Error('documents must be an array with string elements');
      }

      summarized = await processAllChunks(req.body.content, req.body.prompt, req.body.maxTokens, req.body.promptType);

    // "chunk" summarization path
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

router.post('/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const fileId = req.body.fileId;
    const summary = req.body.summary;
    const response = await processChat(prompt, fileId, summary);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

router.post('/text-analysis', async (req, res) => {
  try {
    const content = req.body.content;
    const prompt = req.body.prompt;
    const response = await analyzeText(prompt, content);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

router.post('/text-extract', async (req, res) => {
  try {
    const url = req.body.fileUrl;
    const text = await extractText(url);
    res.status(200).json(text);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

router.post('/embeddings', async (req, res) => {
  try {
    const content = req.body.content;
    const fileId = req.body.fileId;
    const response = await saveContentEmbeddings(fileId, content);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

export default router;
