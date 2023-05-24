/* eslint-disable import/prefer-default-export */
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

require('dotenv').config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

const openai = new OpenAIApi(configuration);

// PROMPT DESIGN
// can adjust this to fine-tune model output
// =============================================================================
const buildPrompt = (content) => {
  // replace this with input from frontend, later
  const age = '21';
  const fieldOfInterest = 'Computer Science, with a minor in Economics';

  const background = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comphrehension.';
  const context = `The reader is ${age}, and their field(s) of interest is/are ${fieldOfInterest}. As such, they may require more detail in topics not related to these fields.`;
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

// processes an entire document
const processText = async (content) => {
  const chunks = content.split('\n').map((chunk) => { return chunk.trim(); });
  const summaries = await Promise.all(chunks.map((chunk) => { return getSummary(chunk); }));
  const tuples = chunks.map((chunk, index) => { return [chunk, summaries[index]]; });
  return tuples;
};

export { processText };
