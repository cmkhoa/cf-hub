/**
 * Gemini AI Service for CF Hub Career Guidance
 * Handles text and file-based interactions with Google's Gemini API
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_CONFIG } from '@/config/gemini';

// Initialize Gemini API lazily per call to avoid SSR/env timing issues
function getModel(modelName) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

// Career guidance system prompt
const SYSTEM_PROMPT = `You are Hubee, the official Career Mentor AI of CF Hub, an all-in-one job mentorship platform helping international and U.S. students build careers in America.

Your role is to act as a personal career mentor — giving clear, structured, and motivational guidance from A to Z in the U.S. job search process: career orientation, resume & LinkedIn writing, networking, interview prep, offer negotiation, and post-offer success.

You combine the warmth of a human mentor with the accuracy and depth of a professional career coach who understands U.S. recruitment systems (ATS, networking culture, OPT/CPT, visa sponsorship, etc.).

Always answer with empathy, practicality, and American workplace realism — your tone should be professional yet encouraging, similar to a trusted senior mentor at a U.S. career center or consulting firm.

You can:

Personalize your advice based on user’s background (major, visa, GPA, experience, target roles, preferred locations).

Generate career roadmaps, timeline plans, and weekly tasks.

Review resumes, cover letters, and LinkedIn profiles with actionable feedback. For this task you will reference the user's attached resume file if provided, otherwise give general best practices. Follow the Jack's resume framework: clear header, professional summary, skills section, experience with quantifiable achievements, education, and relevant projects or certifications. Provide detailed feedback base on the xyz method: eXperience (what you did), Your Impact (quantifiable results), Skills demonstrated (relevant skills/technologies).

Simulate mock interviews (behavioral, case, or technical). Ask the user for their resume, and based on that, generate tailored interview questions and feedback.
Due to technical limitations, you cannot directly read PDF or DOCX files in this browser-based mode. However, the user likely wants help with these documents. Please:
- Provide guidance on how to format and structure these documents effectively.
- Suggest networking messages, follow-ups, and email templates.


Provide curated lists of companies, programs, or job boards relevant to the user’s interests.

Always begin by understanding the user’s current situation and target — then give concrete, step-by-step guidance toward their next milestone.

You are part of the CF Hub ecosystem, a mentorship network connecting Vietnamese and international students with experienced mentors in tech, finance, consulting, and data careers across the U.S.

If the user is new, greet them warmly and explain briefly:

“Hi, I’m Hubee — your career mentor from CF Hub. I’ll guide you from start to offer in the U.S. job market — everything from building your resume and networking to landing interviews and negotiating offers.”

💬 Example User Intents Hubee Should Handle:

“Help me make a U.S.-style resume for data analyst roles.”

“I’m on F1 visa — which companies can sponsor me?”

“Create a 4-week plan to prepare for behavioral interviews.”

“Review this LinkedIn headline for consulting.”

“How do I email an alum after a coffee chat?”

“Compare my resume to U.S. job descriptions and point out gaps.”

“I have two offers — how do I negotiate salary?”

Rules:
- Do not mention directly, the methods that you will use. Make it seem like a natural part of your mentoring process.
- You will answer in the same language that the user asked the question.
- Keep "answer" concise, practical, and mentor-like.
- The returned answer string should be under 50 words. with follow up questions acting as natural ways of extending the conversation and specifying the need of the user.
- Never mention you are an AI model or language model.
- For questions that relate to CF-Hub specifically, refer the user to the facebook account https://www.facebook.com/CareerFoundationHub. Insert as hyperlink.
`;

/**
 * Convert file to Gemini-compatible format
 */
async function fileToGenerativePart(file) {
  // Only inline image files in the browser SDK; PDFs/DOCs should be handled via Files API server-side.
  if (!file?.type?.startsWith('image/')) {
    console.log('Skipping non-image file:', file.name, file.type);
    return null;
  }
  
  console.log('Converting image file to base64:', file.name, file.type);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      
      console.log('Image converted successfully:', file.name, `${base64Data.length} bytes`);
      
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', file.name, error);
      reject(error);
    };
    
    // The file object structure from the chatroom has a nested 'file' property
    const actualFile = file.file || file;
    reader.readAsDataURL(actualFile);
  });
}

/**
 * Generate career guidance response from Gemini
 * @param {string} userMessage - The user's text message
 * @param {Array} files - Array of attached files
 * @param {Array} conversationHistory - Previous messages for context (includes current session)
 * @returns {Promise<string>} - AI response
 */
export async function generateCareerGuidance(userMessage, files = [], conversationHistory = []) {
  try {
    // Check if API key is configured
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.');
    }

    // Use Gemini Pro Vision if files are attached, otherwise use Gemini Pro
  const primaryModelName = GEMINI_CONFIG?.MODEL || 'gemini-1.5-pro';
  const model = getModel(primaryModelName);

    // Build conversation context from ALL messages (includes current session)
    // Take recent history to manage context window (last 10 exchanges = 20 messages)
    const recentHistory = conversationHistory.slice(-20);
    
    // Build conversation history string similar to chatService
    let conversationHistoryText = '';
    recentHistory.forEach(msg => {
      if (msg.role === 'user') {
        conversationHistoryText += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversationHistoryText += `Assistant: ${msg.content}\n`;
      }
    });

    // Create full context prompt with system instructions and conversation history
    let contextPrompt = SYSTEM_PROMPT;
    
    if (conversationHistoryText.trim()) {
      contextPrompt += `\n\nPrevious conversation:\n${conversationHistoryText}`;
    }
    
    contextPrompt += `\n\nCurrent user message: ${userMessage}`;

    // Prepare content parts; include images inline, describe non-image docs textually
    const parts = [{ text: contextPrompt }];

    // Process files if attached
    if (files?.length) {
      console.log('Processing files for Gemini:', files); // Debug log
      
      const imageFiles = files.filter(f => f.type?.startsWith('image/'));
      const nonImageFiles = files.filter(f => !f.type?.startsWith('image/'));

      // Handle non-image files (PDF, DOCX)
      if (nonImageFiles.length) {
        const fileList = nonImageFiles.map(f => `"${f.name}" (${f.type})`).join(', ');
        parts.push({
          text: `\n\n[User attached ${nonImageFiles.length} document file(s): ${fileList}]\n\nNote: You cannot directly read PDF or DOCX files in this browser-based mode. However, the user likely wants help with these documents. Please:\n1. Ask the user to describe the key content if needed (e.g., "Can you tell me about your main experience listed on the resume?")\n2. Provide general guidance based on best practices for the document type\n3. If it's a resume, offer to review it if they can share key sections via text or screenshot\n4. Suggest they can copy-paste relevant text sections for detailed feedback`
        });
      }

      // Handle image files (including resume screenshots)
      if (imageFiles.length) {
        const inlineImages = (await Promise.all(imageFiles.map(fileToGenerativePart))).filter(Boolean);
        if (inlineImages.length) {
          parts.push({ 
            text: `\n\n[User attached ${imageFiles.length} image(s)/screenshot(s)]\n\nPlease carefully analyze the attached image(s). If they contain:\n- Resume/CV: Provide detailed feedback using the XYZ method and Jake's Resume framework\n- LinkedIn profile: Review and suggest improvements\n- Job description: Help tailor their application materials\n- Other content: Analyze and provide relevant career guidance\n\nImages attached:` 
          });
          parts.push(...inlineImages);
        }
      }
    }

    parts.push({ text: `\n\nAssistant:` });

    // Generate content with simple fallback
    try {
      console.log('Sending request to Gemini with', parts.length, 'parts');
      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini response received successfully');
      return text;
    } catch (primaryErr) {
      console.warn('Primary model call failed, retrying with fallback model', primaryErr);
      const fallback = getModel('gemini-2.0-flash-exp');
      const result2 = await fallback.generateContent(parts);
      const response2 = await result2.response;
      console.log('Fallback model response received successfully');
      return response2.text();
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      throw new Error('API configuration error. Please contact support.');
    } else if (error.message?.includes('quota')) {
      throw new Error('API usage limit reached. Please try again later or contact support.');
    } else if (error.message?.includes('safety')) {
      throw new Error('Content was flagged by safety filters. Please rephrase your question.');
    } else if (error.message?.toLowerCase().includes('fetch') || error.message?.toLowerCase().includes('network')) {
      throw new Error('Network error contacting Gemini. Check your internet connection and referrer restrictions for the API key.');
    } else {
      throw new Error('Failed to generate response. Please try again.');
    }
  }
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} - Validation result with success flag and message
 */
export function validateFile(file) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (file.size > MAX_SIZE) {
    return {
      success: false,
      message: 'File size must be less than 10MB'
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      message: 'Please upload PDF, DOCX, or image files only'
    };
  }

  return {
    success: true,
    message: 'File is valid'
  };
}

/**
 * Generate a quick career tip (for homepage or quick interactions)
 * @returns {Promise<string>} - Career tip
 */
export async function generateQuickTip() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `${SYSTEM_PROMPT}

Generate a single, actionable career tip for Vietnamese professionals. Keep it concise (2-3 sentences), specific, and immediately useful. Focus on topics like:
- Resume optimization
- Interview preparation
- Networking strategies
- Skill development
- Job search tactics

Tip:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating quick tip:', error);
    return 'Connect with professionals in your target industry through informational interviews. Prepare 3-4 thoughtful questions and follow up with a thank-you note to build lasting relationships.';
  }
}
