import { Router } from 'express';
// import { CastError } from 'mongoose'; // chatGPT
// import * as Posts from './controllers/chunk_controller';
// import signS3 from './services/s3';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

export default router;
