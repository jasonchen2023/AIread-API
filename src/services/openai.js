// // functions to interact with openai API

// const { Configuration, OpenAIApi } = require('openai');

// const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
// const openai = new OpenAIApi(configuration);

// /*
// const response = await openai.createCompletion({
//   model: 'text-davinci-003',
//   prompt: 'Say this is a test',
//   temperature: 0,
//   max_tokens: 7,
// });
// */

// const createCompletion;
// // streaming: https://github.com/openai/openai-node/issues/18#issuecomment-1369996933

// const createChatCompletion;

// export default async function getSummary(content) {
//   const response = await openai.createCompletion({
//     model: 'davinci',
//     prompt: `Please summarize the following text:\n${content}`,
//     temperature: 0.5,
//     max_tokens: 60,
//     stop: ['\n'],
//   });

//   const summary = response.choices[0].text.trim();
//   return summary;
// }

// streaming: https://github.com/openai/openai-node/issues/18#issuecomment-1369996933