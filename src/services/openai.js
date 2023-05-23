// functions to interact with openai API

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const prompt = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comphrehension. Please summarize the following text to bullets, while preserving as much important information as possible.';

/*
const response = await openai.createCompletion({
  model: 'text-davinci-003',
  prompt: 'Say this is a test',
  temperature: 0,
  max_tokens: 7,
});
*/

export default async function getSummary(content) {
  const response = await openai.createCompletion({
    model: 'davinci',
    prompt: `${prompt}\n${content}`,
    temperature: 0.5,
    max_tokens: 60,
    stop: ['\n'],
  });

  const summary = response.choices[0].text.trim();
  return summary;
}

// streaming: https://github.com/openai/openai-node/issues/18#issuecomment-1369996933
