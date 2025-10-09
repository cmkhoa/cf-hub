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
const SYSTEM_PROMPT = `You are a professional career advisor for CF Hub, a Vietnamese-American career development platform. Your role is to provide expert guidance on:

**Core Responsibilities:**
- Resume review and optimization for tech, finance, consulting, and other professional fields
- Career path planning and industry insights
- Interview preparation (behavioral, technical, case interviews)
- Skill development roadmaps tailored to specific careers
- Job search strategies for Vietnamese professionals in the US and international markets
- Networking and personal branding advice

**Communication Style:**
- Professional yet approachable and encouraging
- Culturally aware of Vietnamese-American professional experiences
- Provide specific, actionable advice rather than generic tips
- Use bullet points and clear structure for complex topics
- Reference real industry standards and expectations
- Be honest about challenges while maintaining optimism

**When reviewing resumes:**
- Evaluate format, content, and ATS compatibility
- Check for quantifiable achievements and impact
- Assess keyword optimization for target roles
- Suggest improvements for clarity and conciseness
- Highlight strengths and areas for improvement

**When discussing career paths:**
- Reference CF Hub's career visualizer paths (Finance, Consulting, Tech, Marketing)
- Provide realistic timelines and skill requirements
- Discuss industry trends and market demand
- Suggest relevant certifications and educational paths

**Important Guidelines:**
- If you don't have enough context, ask clarifying questions
- For technical topics, provide accurate and up-to-date information
- Encourage users to leverage CF Hub's resources (webinars, mentorship, blog)
- Be mindful of visa status and international student concerns when relevant
- Never guarantee job outcomes, but provide data-driven insights

Remember: You represent CF Hub's commitment to empowering Vietnamese professionals in their career journeys.`;

/**
 * Convert file to Gemini-compatible format
 */
async function fileToGenerativePart(file) {
  // Only inline image files in the browser SDK; PDFs/DOCs should be handled via Files API server-side.
  if (!file?.type?.startsWith('image/')) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file.file);
  });
}

/**
 * Generate career guidance response from Gemini
 * @param {string} userMessage - The user's text message
 * @param {Array} files - Array of attached files
 * @param {Array} conversationHistory - Previous messages for context
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

    // Build conversation context (last 5 messages for context window management)
    const recentHistory = conversationHistory.slice(-10);
    let contextPrompt = SYSTEM_PROMPT + '\n\nConversation History (most recent first):\n';
    
    recentHistory.forEach(msg => {
      if (msg.role === 'user') {
        contextPrompt += `\nUser: ${msg.content}`;
      } else if (msg.role === 'assistant') {
        contextPrompt += `\nAssistant: ${msg.content}`;
      }
    });

    // Prepare content parts; include images inline, describe non-image docs textually
    const parts = [{ text: contextPrompt }];

    // Process files if attached
    if (files?.length) {
      const imageFiles = files.filter(f => f.type?.startsWith('image/'));
      const nonImageFiles = files.filter(f => !f.type?.startsWith('image/'));

      if (nonImageFiles.length) {
        const names = nonImageFiles.map(f => f.name).join(', ');
        parts.push({
          text: `\n\nThe user attached ${nonImageFiles.length} document(s): ${names}. You cannot directly read these in this mode. If any are resumes, provide a structured resume review based on the user's message and typical best practices (format, ATS, quantifiable impact, tailoring).`
        });
      }

      if (imageFiles.length) {
        const inlineImages = (await Promise.all(imageFiles.map(fileToGenerativePart))).filter(Boolean);
        if (inlineImages.length) {
          parts.push({ text: '\n\nThe user also attached image(s)/screenshot(s). Analyze them if relevant:' });
          parts.push(...inlineImages);
        }
      }
    }

    parts.push({ text: `\n\nUser: ${userMessage}\n\nAssistant:` });

    // Generate content with simple fallback
    try {
      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (primaryErr) {
      console.warn('Primary model call failed, retrying with gemini-1.5-flash', primaryErr);
      const fallback = getModel('gemini-1.5-flash');
      const result2 = await fallback.generateContent(parts);
      const response2 = await result2.response;
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
