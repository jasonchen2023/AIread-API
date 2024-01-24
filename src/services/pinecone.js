import { Pinecone } from '@pinecone-database/pinecone';

require('dotenv').config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: 'gcp-starter',
});

const storeEmbedding = async (fileId, contentChunks, embeddings, startingIndex) => {
  try {
    const index = pinecone.index('semantic-search-openai').namespace(fileId);
    let records = [];
    for (let i = 0; i < embeddings.length; i++) {
      const currentIndex = startingIndex + i;
      records.push({
        id: currentIndex.toString(),
        values: embeddings[i].embedding,
        metadata: { content: contentChunks[i] }
      });
    }
    
    const res = await index.upsert(records);
    console.log("success", res);
    return res;
  } catch (error) {
    console.error(`Error storing embedding for file ${fileId}:`, error);
    throw new Error('Failed to store embedding in Pinecone');
  }
};

const retrieveChunks = async (embedding, fileId) => {
  try {
    const index = pinecone.index('semantic-search-openai');
    const k = 3; // number of chunks retrieved

    const res = await index.namespace(fileId).query({
      topK: k,
      vector: embedding,
      includeMetadata: true
    });

    return res.matches;
  } catch (error) {
    throw new Error(`request to Pinecone failed with error: ${error}`);
  }
};

export {storeEmbedding, retrieveChunks} 
