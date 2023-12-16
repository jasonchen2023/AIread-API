import { Configuration, OpenAIApi } from 'openai';

require('dotenv').config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

const openai = new OpenAIApi(configuration);

// PROMPT DESIGN
// can adjust this to fine-tune model output
// =============================================================================
const buildSummarizePrompt = (content) => {
  const background = 'You are an AI summarization agent. Your goal is to distill information down for readers to accelerate learning and comprehension.';
  const instructions = ' The summary should preserve as much important information as possible.';
  instructions.concat(' The summary should be short, providing a quick glimpse into the content. The reader should be able to quickly read this for a high-level overview of the content.');

  /*
  if (intensity === 0) {
    } else if (intensity === 1) {
    instructions.concat(' The summary should be medium length, providing a quick skim into the content. The reader should be able to skim this for a medium-level overview of the content.');
  } else if (intensity === 2) {
    instructions.concat(' The summary should be detailed, providing a good analysis of the content. The reader should be able to read this summary and gain a strong understanding of the content.');
  } else if (intensity === 3) {
    instructions.concat(' The summary should dissect the content, providing a very good analysis of the content, and help the reader fully understand the content efficiently.');
  }
  */

  const task = ' Please summarize the above text. Bullet form. Output in Markdown.';
  const prompt = `${content}\n\n\n\n${background}${instructions}${task}`;
  return prompt;
};

const buildCustomPrompt = (content, customPrompt) => {
  const background = 'You are an AI agent. Your goal is to distill information down for readers to accelerate learning and comprehension.';
  let instructions = ' Please perform the following user instruction on the content below. The user instruction is ' + customPrompt + ". ";
  instructions = instructions.concat(' The response should be short, in bullet form, and in Markdown.');

  const prompt = `${background}${instructions} \n\n\n\n Here is the content: ${content}`;
  return prompt;
};

// SUMMARY LOGIC
// =============================================================================
const getSummary = async (content, customPrompt) => {
  try {
    let prompt = (customPrompt == null) ? buildSummarizePrompt(content) : buildCustomPrompt(content, customPrompt);

    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    let summary = res.data.choices[0].message.content.trim();

    summary = summary.replace(/•/g, '-'); // change dots into dashes, for markdown
    summary = summary.replace(/[\r]/g, ''); // remove `\r`, affects markdown display
    return summary;
  } catch (err) {
    console.log(`request to OpenAI failed with error: ${err}, ${err.message}`);
    throw err;
  }
};

// processes an entire document (chunkified). Content = list of strings
const processAllChunks = async (content, customPrompt) => {
  try {
    const summaries = await Promise.all(content.map((chunk) => { return getSummary(chunk, customPrompt); }));
    const tuples = content.map((chunk, index) => { return [chunk, summaries[index]]; });
    return tuples;
  } catch (error) {
    console.error('Failed to process text:', error);
    throw error; // Or handle it in a way you see fit
  }
};

// processes one chunk. Content type = string
const processChunk = async (content) => {
  const summary = await getSummary(content);
  return [content, summary];
};

const buildChatMessage = (content, prompt) => {
  let instructions = 'You are an AI assistant. Your goal is to answer the users\' questions. The questions may or may not be about the document content. You\'re job is to consider the document content first.';
  instructions = instructions.concat('If the question is about the document content, use the content to answer the question. If not, mention that the document does not contain the answer. Then, answer based on your own knowledge');

  let userMessage = "I would like to know the following: " + prompt + ". Here is my reading document: " + content;
  let messages = [
    {role: "system", content: instructions},
    {role: "user", content: userMessage}
  ]

  return messages;
}

// process an isolated chat prompt
const processChat = async (content, prompt) => {
  try {
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-1106',
      messages: buildChatMessage(content, prompt),
      max_tokens: 200,
      temperature: 0.7,
    });
    
    let chatResponse = res.data.choices[0].message.content.trim();
    return chatResponse;
  } catch (err) {
    console.log(`request to OpenAI failed with error: ${err.message}`);
    throw (err);
  }
};

export { processAllChunks, processChunk, processChat };
