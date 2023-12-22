import ConvertAPI from 'convertapi';
import fetch from 'node-fetch';

require('dotenv').config();

const convertapi = new ConvertAPI(process.env.CONVERTAPI_API_KEY);

const extractText = async (pdfUrl) => {
  try {
    const result = await convertapi.convert('txt', { File: pdfUrl }, 'pdf');
    const url = result.response.Files[0].Url;

    const response = await fetch('https://v2.convertapi.com/d/v6xhkgc0h5adwex3nrxh96rpirb4iryt/P3_lab1_motionAccel_F23-1.txt');  // extract text from the returned link
    const data = await response.text();

    return data;

  } catch (error) {
    console.error('Error extracting text:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

export default extractText;