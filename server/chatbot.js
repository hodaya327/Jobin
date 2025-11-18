import { GoogleGenAI } from '@google/genai';
import * as readline from 'readline';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat() {
  rl.question('You: ', async (userInput) => {
    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      return;
    }

    console.log("API KEY:", process.env.GEMINI_API_KEY);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
    });

    console.log(`AI: ${response.text}\n`);
    chat(); // Continue the conversation
  });
}

console.log('Chatbot started! Type "exit" to quit.\n');
chat();