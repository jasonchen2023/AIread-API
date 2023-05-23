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

  const prompt = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comphrehension. Please summarize the following text to bullets, while preserving as much important information as possible.';

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${prompt}\n\n${content}`,
    max_tokens: 500,
  });

  const summary = response.data.choices[0].text.trim();

  const chunk = {
    content,
    summary,
  };
  console.log(chunk);
  return chunk;
};

const chunkify = (content) => {
  const chunks = [];
  return chunks;
};

const processText = async (content) => {
  const chunks = chunkify(content);
  const summarizedChunks = [];
  return summarizedChunks;
};

const testContent = 'This technical report presents GPT-4, a large multimodal model capable of processing image andtext inputs and producing text outputs. Such models are an important area of study as they have the potential to be used in a wide range of applications, such as dialogue systems, text summarization, and machine translation. As such, they have been the subject of substantial interest and progress in recent years [1–34].\n  One of the main goals of developing such models is to improve their ability to understand and generate natural language text, particularly in more complex and nuanced scenarios. To test its capabilities in such scenarios, GPT-4 was evaluated on a variety of exams originally designed for humans. In these evaluations it performs quite well and often outscores the vast majority of human test takers. For example, on a simulated bar exam, GPT-4 achieves a score that falls in the top 10% of test takers. This contrasts with GPT-3.5, which scores in the bottom 10%.\n  On a suite of traditional NLP benchmarks, GPT-4 outperforms both previous large language models and most state-of-the-art systems (which often have benchmark-specific training or hand-engineering). On the MMLU benchmark [35, 36], an English-language suite of multiple-choice questions covering 57 subjects, GPT-4 not only outperforms existing models by a considerable margin in English, but also demonstrates strong performance in other languages. On translated variants of MMLU, GPT-4 surpasses the English-language state-of-the-art in 24 of 26 languages considered. We discuss these model capability results, as well as model safety improvements and results, in more detail in later sections.\n  This report also discusses a key challenge of the project, developing deep learning infrastructure and optimization methods that behave predictably across a wide range of scales. This allowed us to make predictions about the expected performance of GPT-4 (based on small runs trained in similar ways) that were tested against the final run to increase confidence in our training. Despite its capabilities, GPT-4 has similar limitations to earlier GPT models [1, 37, 38]: it is not fully reliable (e.g. can suffer from “hallucinations”), has a limited context window, and does not learn from experience. Care should be taken when using the outputs of GPT-4, particularly in contexts where reliability is important.\n  GPT-4’s capabilities and limitations create significant and novel safety challenges, and we believe careful study of these challenges is an important area of research given the potential societal impact. This report includes an extensive system card (after the Appendix) describing some of the risks we foresee around bias, disinformation, over-reliance, privacy, cybersecurity, proliferation, and more. It also describes interventions we made to mitigate potential harms from the deployment of GPT-4, including adversarial testing with domain experts, and a model-assisted safety pipeline.';

router.route('/test')
  .post(async (req, res) => {
    try {
      // const summarized = await processText(req.body.content);
      const summarized = await testOpenAI(testContent);
      res.json(summarized);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error });
    }
  });

export default router;
