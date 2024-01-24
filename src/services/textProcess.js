import ConvertAPI from 'convertapi';
import fetch from 'node-fetch';
import { getEmbedding } from './openai';
import { storeEmbedding } from './pinecone';

require('dotenv').config();

const convertapi = new ConvertAPI(process.env.CONVERTAPI_API_KEY);

const extractText = async (pdfUrl) => {
  try {
    const result = await convertapi.convert('txt', { File: pdfUrl }, 'pdf');
    const url = result.response.Files[0].Url;

    const response = await fetch(url); 
    const data = await response.text();

    return data;

  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

const chunkifyContent = (rawContent, wordsPerChunk, overlap) => {
  const words = rawContent.split(' ');
  const chunks = [];
  let currentChunk = [];

  for (let i = 0; i < words.length; i++) {
    currentChunk.push(words[i]);

    if (currentChunk.length >= wordsPerChunk) {
      chunks.push(currentChunk.join(' ')); 
      i = Math.max(0, i - overlap);
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}


const saveContentEmbeddings = async (fileId, content) => {
  try {

    console.log(content, fileId);

    const wordsPerChunk = 200;
    const overlap = 50;
    const chunks = chunkifyContent(content, wordsPerChunk, overlap);
    
    for (let i = 0; i < chunks.length; i += 26) {
      const currentChunks = chunks.slice(i, i + 26);
      const embeddings = await getEmbedding(currentChunks);
      const res = await storeEmbedding(fileId, currentChunks, embeddings, i);
      console.log("stored");
    }
  } catch (error) {
    console.error('Error saving embedding:', error);
    throw error;
  }
};


export { extractText, chunkifyContent, saveContentEmbeddings };