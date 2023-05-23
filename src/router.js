import { Router } from 'express';
import { getSummary } from './services/openai';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to the airead api!' });
});

// routes for /summaries
//     post: return openai completion
//     get: get openai completion, if exists?
router.route('/summaries')
  .post(async (req, res) => {
    try {
      const { content } = req.body.content; // pre processing of content
      const chunk = await getSummary(content);
      res.json(chunk);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error });
    }
  })
  .get(async (req, res) => {
    try {
      res.send('Hello World');
    } catch (error) {
      res.status(500).json({ error });
    }
  });

// testing, move to openai.js later
const testOpenAI = async (content) => {
  // eslint-disable-next-line global-require
  const { Configuration, OpenAIApi } = require('openai');

  const configuration = new Configuration({ apiKey: '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' });
  const openai = new OpenAIApi(configuration);

  // const prompt = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comphrehension. Please summarize the following text to bullets, while preserving as much important information as possible.';

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: content,
  });

  const summary = response.data.choices[0].text.trim();

  const chunk = {
    content,
    summary,
  };
  console.log(chunk);
  return chunk;
};

router.route('/test')
  .post(async (req, res) => {
    try {
      const { content } = req.body;
      const chunk = await testOpenAI(content);
      res.json(chunk);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error });
    }
  });

export default router;

// Routes for /posts
/*
router.route('/posts')
  .post(async (req, res) => {
    try {
      const result = await Posts.createPost(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  .get(async (req, res) => {
    try {
      const result = await Posts.getPosts();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

// Routes for /posts/:id
router.route('/posts/:id')
  .get(async (req, res) => {
    try {
      const result = await Posts.getPost(req.params.id);
      res.json(result);
    } catch (error) {
      if (error instanceof CastError) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(500).json({ error });
      }
    }
  })
  .put(async (req, res) => {
    try {
      const result = await Posts.updatePost(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      if (error instanceof CastError) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(500).json({ error });
      }
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Posts.deletePost(req.params.id);
      res.json(result);
    } catch (error) {
      if (error instanceof CastError) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(500).json({ error });
      }
    }
  });
*/
