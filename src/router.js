import { Router } from 'express';

const router = Router();

router.get('/gpt', (req, res) => {
  res.json({ response: 'this is a test summary' });
});

export default router;
