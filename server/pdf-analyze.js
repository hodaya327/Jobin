import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Helper function to convert PDF to base64
function pdfToGenerativePart(path) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType: 'application/pdf'
    },
  };
}

async function analyzePDFAndCreateSong() {
  console.log('Reading PDF file...');
  
  // Read the PDF file
  const pdfPart = pdfToGenerativePart('document.pdf');
  
  console.log('Sending to Gemini AI...');
  
  // Send to Gemini with creative prompt
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      pdfPart,
      `Please do two things:
      1. Summarize the main content of this PDF document
      2. Write a creative, fun song about the content (with verses and chorus)
      
      Format your response with clear sections.`
    ],
  });

  console.log('\n' + '='.repeat(60));
  console.log(' GEMINI\'S RESPONSE ');
  console.log('='.repeat(60) + '\n');
  console.log(response.text);
  console.log('\n' + '='.repeat(60));
}

// Run the function
analyzePDFAndCreateSong().catch(error => {
  console.error('Error:', error.message);
});
export { analyzePDFAndCreateSong };
