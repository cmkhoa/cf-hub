// Simple test script for Gemini API
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyB0XorcK4Rc9dqa-9evrEsOFcYVl44JoNs";

async function testModels() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const modelsToTest = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest", 
    "gemini-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`\n--- Testing ${modelName} ---`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello in one sentence");
      const response = await result.response;
      console.log(`✅ ${modelName} works! Response:`, response.text());
      break; // Stop after first successful model
    } catch (error) {
      console.log(`❌ ${modelName} failed:`, error.message.split('\n')[0]);
    }
  }
}

testModels();
