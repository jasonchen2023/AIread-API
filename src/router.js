import { Router } from 'express';
import { auth } from './firebase';

const router = Router();

// token auth middleware for /api routes
router.use((req, res, next) => {
  console.log('authorizing request to /api at:', new Date().toLocaleTimeString());
  const token = req.get('authorization');
  auth.verifyIdToken(token)
    .then((decodedToken) => {
      console.log(`authorized user ${decodedToken.uid}`);
      next();
    })
    .catch((error) => {
      console.log('failed to authorize user');
      res.status(401).send('Invalid auth');
    });
});

router.get('/gpt', (req, res) => {
  res.status(200).json({ response: 'this is a test summary' });
});

export default router;
