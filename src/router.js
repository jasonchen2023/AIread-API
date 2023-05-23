import { Router } from 'express';
import openai from './services/openai';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

/// your routes will go here

// routes for /summaries
//     post: return openai co
router.route('/summaries')
  .post(async (req, res) => {
    try {
      openai.summarize(req.body.content);
    } catch (error) {
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
