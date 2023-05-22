import { Router } from 'express';
import { CastError } from 'mongoose'; // chatGPT
import * as Posts from './controllers/chunk_controller';
import signS3 from './services/s3';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

/// your routes will go here

router.get('/sign-s3', signS3);

// routes for /docs
//     post: create a new doc
//     get: get all docs

// routes for /docs/:id
//     get: get a doc
//     put: update a doc
//     delete: delete a doc

// Routes for /posts
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

export default router;
