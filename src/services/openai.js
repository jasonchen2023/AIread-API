/* eslint-disable import/prefer-default-export */
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

require('dotenv').config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

const openai = new OpenAIApi(configuration);

// PROMPT
// can adjust this to fine-tune model output

const prompt = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comphrehension. Please summarize the following text to bullets, while preserving as much important information as possible.';

// gets summary for a chunk of text
const getSummary = async (content) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${prompt}\n\n${content}`,
    max_tokens: 1000,
  });

  const summary = response.data.choices[0].text.trim();
  return summary;
};

// processes an entire document
const processText = async (content) => {
  const chunks = content.split('\n').map((chunk) => { return chunk.trim(); });
  const summaries = await Promise.all(chunks.map((chunk) => { return getSummary(chunk); }));
  const tuples = chunks.map((chunk, index) => { return [chunk, summaries[index]]; });
  return tuples;
};

// process an isolated chat request
const chat = async (content) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${content}`,
    max_tokens: 1000,
  });

  return response.data.choices[0].text;
};

export { chat, processText };
