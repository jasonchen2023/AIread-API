import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

// .env setup
dotenv.config({ silent: true });

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// PROMPT DESIGN
// can adjust this to fine-tune model output
// =============================================================================
const buildPrompt = (content) => {
  
  // replace this with input from content now
  const age = '21';

  const background = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comphrehension.';
  const context = `The reader is ${age} `;
  const instructions = 'Your summaries should preserve as much important information as possible.';
  const task = 'Please summarize the following text, bullet form.';
  const prompt = `${background}\n${context} ${instructions}\n${task}`;
  return prompt;
};

// SUMMARY LOGIC
// =============================================================================
const getSummary = async (content) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: buildPrompt(content),
    max_tokens: 1000,
  });

  const summary = response.data.choices[0].text.trim();
  return summary;
};

export default getSummary;
