import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: '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' });
// const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// PROMPT
// can adjust this to fine-tune model output
const prompt = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comphrehension. Please summarize the following text to bullets, while preserving as much important information as possible.';

const getSummary = async (content) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${prompt}\n\n${content}`,
    max_tokens: 1000,
  });

  const summary = response.data.choices[0].text.trim();
  return summary;
};

export default getSummary;
