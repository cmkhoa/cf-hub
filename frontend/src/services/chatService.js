import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '@/config/gemini';

class ChatService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL });
  }

  async generateResponse(messages) {
    try {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.role !== 'user') {
        throw new Error('Last message must be from user');
      }

      let conversationHistory = '';
      messages.forEach((msg) => {
        if (msg.role === 'user') {
          conversationHistory += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          conversationHistory += `Assistant: ${msg.content}\n`;
        }
      });

      const systemPrompt = this.createSystemPrompt(conversationHistory, lastMessage.content);

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        role: 'assistant',
        content: text
      };

    } catch (error) {
      console.error('ChatService Error:', error);
      throw error;
    }
  }

  createSystemPrompt(conversationHistory, userMessage) {
    return `You are a helpful AI assistant for CF Hub, a mentorship platform connecting Vietnamese students and professionals with industry experts in the United States.

About CF Hub:
- Mission: To empower financial professionals by providing access to quality education, mentorship, and networking opportunities
- Features: Peer-to-Peer Mentoring, Resource Library, Community Forums, Career Development Tools, Industry Insights, Networking Events
- Statistics: Over 100 successful mentees, over 100 mentors across the United States, over 15 years of experience
- Contact: info@cfhub.com, https://cfhub.com

Your role:
- Help users understand CF Hub's services and programs
- Provide career guidance and mentorship information
- Answer questions about joining as a mentor or mentee
- Share information about workshops, webinars, and events
- Offer general career advice within the financial industry

Previous conversation:
${conversationHistory}

Current user question: ${userMessage}

Please provide a helpful response that addresses the user's question while staying within the context of CF Hub's mission and services. Your response should be concise, informative, clear and to the point. For example, if the user asks about the mentorship program, you should provide a concise answer about the program, its features, and its benefits. Do not provide a too long answer, or a too short answer. Use less special characters and symbols. Use simple language and avoid using too many words. Bullet points are allowed and encouraged. Break the line for each point (bullet point).`;
  }
}

export default ChatService;
