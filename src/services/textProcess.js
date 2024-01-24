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

    const response = await fetch(url);  // extract text from the returned link
    const data = await response.text();

    // const data = `Whispers in moonlight, secrets softly told,
    //   Shadows dance, a tale to unfold.
    //   Nature's lullaby, a silent serenade,
    //   Night's embrace, dreams cascade.
    //   Stars witness, as the night unfolds.
    // `

    return data;

  } catch (error) {
    console.error('Error extracting text:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

const chunkifyContent = (rawContent, wordsPerChunk, overlap) => {
  const words = rawContent.split(' ');
  const chunks = [];
  let currentChunk = [];

  for (let i = 0; i < words.length; i++) {
    currentChunk.push(words[i]);

    if (currentChunk.length >= wordsPerChunk) {
      chunks.push(currentChunk.join(' ')); // Convert currentChunk to string with space between words before pushing
      i = Math.max(0, i - overlap);
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' ')); // Convert the last currentChunk to string with space between words before pushing
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