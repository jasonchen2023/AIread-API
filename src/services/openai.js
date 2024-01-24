import { Configuration, OpenAIApi } from 'openai';
import { retrieveChunks } from './pinecone';

require('dotenv').config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

const openai = new OpenAIApi(configuration);

const buildPrompt = (content, customPrompt, promptType) => {
  if (promptType === 'chat-context') {
    const background = 'You are an AI summarization agent. Your goal is to provide a summarization of the document, which will be passed in as part of the prompt for the chatbot. This will allow the chatbot to answer questions about the document.';
    const instructions = ' The summary should preserve as much important information as possible about the document.';
    
    const task = ' Please summarize the above text.';
    const prompt = `${content}\n\n\n\n${background}${instructions}${task}`;
    return prompt;
    
  } else {
    customPrompt = customPrompt ?? "summarize the document.";

    const background = 'You are an AI agent. Your goal is to distill information down for readers to accelerate learning and comprehension.';
    let instructions = ` Please perform the following user instruction on the content below. The user instruction is to ${customPrompt}. `;
    instructions = instructions.concat(' The response should be short, in bullet form, and in Markdown.');
  
    const prompt = `${background}${instructions} \n\n\n\n Here is the content: ${content}`;
    return prompt;
  }
}


// SUMMARY LOGIC
// =============================================================================
const getSummary = async (content, customPrompt, maxTokens = 1000, promptType) => {
  try {
    let prompt = buildPrompt(content, customPrompt, promptType);
    console.log('prompt', prompt);
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
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
const processAllChunks = async (content, customPrompt, maxTokens, promptType) => {
  try {
    const summaries = await Promise.all(content.map((chunk) => { return getSummary(chunk, customPrompt, maxTokens, promptType); }));
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

const buildChatMessage = (contentList, prompt, summary) => {
  let instructions = 'You are an AI assistant. Your goal is to answer the users\' questions. The questions may or may not be about the document content. Your job is to consider the document content chunks first.';
  instructions = instructions.concat('If you cannot find the answer, mention that you did not find the answer. Then, answer based on your own knowledge. Otherwise, just present the answer');
  instructions = instructions.concat(`In the case the user asks for something that requires context from the entire paper, here is a summary: ${summary}
`);

  const content = contentList.map((chunk, index) => `${index + 1} a chunk: : ${chunk}`).join('\n \n');
  
  let userMessage = "I would like to know the following: " + prompt + ". Please try to answer using one or more of the chunks or using the summary given if needed: " + content;
  let messages = [
    {role: "system", content: instructions},
    {role: "user", content: userMessage}
  ]

  return messages;
}

// process an isolated chat prompt
const processChat = async (prompt, fileId, summary) => {
  try {

    const embeddingList = await getEmbedding(prompt);
    const embedding = embeddingList[0].embedding;

    const chunkObjects = await retrieveChunks(embedding, fileId);
    const contentList = chunkObjects.map(chunk => chunk.metadata.content);

    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-1106',
      messages: buildChatMessage(contentList, prompt, summary),
      max_tokens: 300,
      temperature: 0.7,
    });
    
    let chatResponse = res.data.choices[0].message.content.trim();
    return chatResponse;
  } catch (err) {
    console.log(`request to OpenAI failed with error: ${err.message}`);
    throw (err);
  }
};

const analyzeText = async (prompt, content) => {
  try {
    const message = [
      { role: 'system', content: 'You are a helpful assistant for a reader reading a piece of text.' },
      { role: 'user', content: `${prompt} ${content}` },
    ];

    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-1106',
      messages: message,
      max_tokens: 300,
      temperature: 0.7,
    });

    if (res.data.choices && res.data.choices.length > 0) {
      let chatResponse = res.data.choices[0].message.content.trim();
      return chatResponse;
    } else {
      throw new Error('Invalid response from OpenAI');
    }
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error; 
  }
};

const getEmbedding = async (chunks) => {
  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: chunks,
      });
    return response.data.data;
  } catch (err) {
    console.error('Error in OpenAI request:', err);
    throw new Error('Failed to retrieve embeddings from OpenAI');
  }
}

export { processAllChunks, processChunk, processChat, getEmbedding, analyzeText };
