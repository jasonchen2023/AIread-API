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
  const fieldOfInterest = 'Computer Science, with a minor in Economics';
  const intensity = 3; // 0, 1, 2, or 3 (glimpse, skim, analyze, dissect)

  const background = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comprehension.';
  const context = `The reader's field(s) of interest is/are ${fieldOfInterest}. As such, they may require more detail in topics not related to these fields.`;
  const instructions = 'The summary should preserve as much important information as possible.';

  if (intensity === 0) {
    instructions.concat(' The summary should be brief, providing a quick glimpse into the content. The reader should be able to quickly read this for a high-level overview of the content.');
  } else if (intensity === 1) {
    instructions.concat(' The summary should be medium length, providing a quick skim into the content. The reader should be able to skim this for a medium-level overview of the content.');
  } else if (intensity === 2) {
    instructions.concat(' The summary should be detailed, providing a good analysis of the content. The reader should be able to read this summary and gain a strong understanding of the content.');
  } else if (intensity === 3) {
    instructions.concat(' The summary should dissect the content, providing a very good analysis of the content, and help the reader fully understand the content efficiently.');
  }

  const task = 'Please summarize the following text, bullet form.';
  const prompt = `${background}\n${context}\n${instructions}\n${task}`;
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
