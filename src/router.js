import { Router } from 'express';
import { auth } from './firebase';
import summariesRouter from './summariesRouter';

const router = Router();

// token auth middleware for /api routes
/*
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
*/

router.get('/', (req, res) => {
  res.json({ message: 'welcome to the airead api!' });
});

router.use('/summaries', summariesRouter);

export default router;
