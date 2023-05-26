/* eslint-disable no-unused-vars */
import { Router } from 'express';
import { auth } from './firebase';
import { processText, processChat } from './services/openai';

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
    const summarized = await processText(req.body.content);
    res.status(200).json(summarized);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

// test (remove after dev)
router.route('/summaries/test')
  .post(async (req, res) => {
    try {
      const testContent = 'This technical report presents GPT-4, a large multimodal model capable of processing image andtext inputs and producing text outputs. Such models are an important area of study as they have the potential to be used in a wide range of applications, such as dialogue systems, text summarization, and machine translation. As such, they have been the subject of substantial interest and progress in recent years [1–34].\n  One of the main goals of developing such models is to improve their ability to understand and generate natural language text, particularly in more complex and nuanced scenarios. To test its capabilities in such scenarios, GPT-4 was evaluated on a variety of exams originally designed for humans. In these evaluations it performs quite well and often outscores the vast majority of human test takers. For example, on a simulated bar exam, GPT-4 achieves a score that falls in the top 10% of test takers. This contrasts with GPT-3.5, which scores in the bottom 10%.\n  On a suite of traditional NLP benchmarks, GPT-4 outperforms both previous large language models and most state-of-the-art systems (which often have benchmark-specific training or hand-engineering). On the MMLU benchmark [35, 36], an English-language suite of multiple-choice questions covering 57 subjects, GPT-4 not only outperforms existing models by a considerable margin in English, but also demonstrates strong performance in other languages. On translated variants of MMLU, GPT-4 surpasses the English-language state-of-the-art in 24 of 26 languages considered. We discuss these model capability results, as well as model safety improvements and results, in more detail in later sections.\n  This report also discusses a key challenge of the project, developing deep learning infrastructure and optimization methods that behave predictably across a wide range of scales. This allowed us to make predictions about the expected performance of GPT-4 (based on small runs trained in similar ways) that were tested against the final run to increase confidence in our training. Despite its capabilities, GPT-4 has similar limitations to earlier GPT models [1, 37, 38]: it is not fully reliable (e.g. can suffer from “hallucinations”), has a limited context window, and does not learn from experience. Care should be taken when using the outputs of GPT-4, particularly in contexts where reliability is important.\n  GPT-4’s capabilities and limitations create significant and novel safety challenges, and we believe careful study of these challenges is an important area of research given the potential societal impact. This report includes an extensive system card (after the Appendix) describing some of the risks we foresee around bias, disinformation, over-reliance, privacy, cybersecurity, proliferation, and more. It also describes interventions we made to mitigate potential harms from the deployment of GPT-4, including adversarial testing with domain experts, and a model-assisted safety pipeline.';
      const summarized = await processText(testContent);
      res.json(summarized);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error });
    }
  });

// chat
router.post('/chat', async (req, res) => {
  console.log(req.body);
  const { content } = req.body;
  console.log(content);
  try {
    const response = await processChat(content);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
});

export default router;
