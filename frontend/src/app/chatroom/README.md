# CF Hub AI Chatroom

## Overview
A modern, AI-powered career guidance chatroom integrated into CF Hub, providing personalized career advice, resume reviews, and professional development guidance using Google's Gemini AI.

## Features

### 🤖 AI Career Assistant
- Powered by Google Gemini 1.5 Pro
- Custom-trained with career guidance prompts
- Understands Vietnamese-American professional contexts
- Provides industry-specific advice (Finance, Tech, Consulting, Marketing)

### 📄 File Upload Capabilities
- **Resume Review**: Upload PDF or DOCX resumes for detailed feedback
- **Screenshot Analysis**: Share interview questions, LinkedIn profiles, or job postings
- **Supported Formats**: PDF, DOCX, JPG, PNG, WebP
- **File Limits**: 10MB per file, 5 files per session

### 💬 Modern Chat Interface
- Clean, responsive UI inspired by ChatGPT/Claude
- Real-time message streaming
- Conversation history with context awareness
- Mobile-optimized with proper input scaling
- Sidebar with session stats and capabilities

### 🛡️ Usage Limits & Safety
- **Message Limit**: 50 messages per session
- **File Size**: 10MB maximum per file
- **File Count**: 5 files maximum per session
- **API Rate Limiting**: Built-in error handling
- **Content Safety**: Gemini safety filters enabled

## Technical Implementation

### File Structure
```
frontend/src/
├── app/
│   └── chatroom/
│       ├── page.js          # Main chatroom component
│       └── chatroom.css     # Styling
└── services/
    └── geminiService.js     # Gemini API wrapper
```

### Key Components

#### 1. ChatRoom Component (`page.js`)
- State management for messages, files, and UI
- File upload handling with validation
- Message sending and receiving
- Mobile sidebar toggle
- Session management

#### 2. Gemini Service (`geminiService.js`)
- API initialization and configuration
- File-to-base64 conversion for multimodal inputs
- Conversation context management
- Error handling and user-friendly messages
- System prompt with career guidance instructions

#### 3. Styling (`chatroom.css`)
- Modern gradient buttons matching CF Hub theme
- Responsive design (desktop, tablet, mobile)
- Message bubbles with proper spacing
- File preview components
- Dark mode support (media query ready)

### Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### System Prompt
The AI is configured with a comprehensive system prompt that covers:
- Resume review and optimization
- Career path planning
- Interview preparation
- Skill development roadmaps
- Job search strategies
- Cultural awareness for Vietnamese professionals
- CF Hub resource integration

## Usage

### For Users
1. Click "Get Started" on the Career Visualizer section
2. Type your question or upload a file
3. Receive personalized career guidance
4. Continue the conversation with follow-up questions
5. Use "New Chat" to start fresh

### For Developers

#### Adding New Capabilities
Edit the system prompt in `geminiService.js`:
```javascript
const SYSTEM_PROMPT = `Your custom instructions here...`;
```

#### Adjusting Limits
Modify constants in `page.js`:
```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_SESSION = 5;
const MAX_MESSAGES_PER_SESSION = 50;
```

#### Custom File Types
Update the `allowedTypes` array in `handleFileChange`:
```javascript
const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  // Add more types...
];
```

## API Integration

### Gemini API Flow
1. User sends message + optional files
2. Files converted to base64 inline data
3. Conversation history (last 10 messages) included for context
4. System prompt + context + user message sent to Gemini
5. Response streamed back and displayed

### Model Selection
- **With files**: `gemini-1.5-pro` (multimodal)
- **Text only**: `gemini-1.5-pro` (faster, cheaper)

### Context Window Management
- Last 10 messages included for context
- System prompt prepended to each request
- File metadata added to prompt for clarity

## Styling Details

### Color Scheme
- Primary: `#3b82f6` (CF Hub blue)
- Secondary: `#2563eb`
- Background: `#f9fafb`
- Text: `#0f2442` (dark), `#64748b` (light)

### Responsive Breakpoints
- Desktop: > 992px (sidebar visible)
- Tablet: 768px - 992px (sidebar toggleable)
- Mobile: < 768px (full-width sidebar)
- Small Mobile: < 480px (optimized spacing, 16px inputs)

### Key CSS Classes
- `.chatroom-container`: Main flex container
- `.chatroom-sidebar`: Collapsible sidebar
- `.messages-container`: Scrollable message area
- `.message-bubble`: Individual message styling
- `.input-wrapper`: Input area with file upload

## Future Enhancements

### Planned Features
- [ ] Conversation history persistence (localStorage/backend)
- [ ] Export conversation as PDF
- [ ] Voice input for questions
- [ ] Suggested follow-up questions
- [ ] User authentication integration
- [ ] Analytics tracking (conversation topics, user satisfaction)
- [ ] Multi-language support (Vietnamese translations)
- [ ] Template prompts for common questions
- [ ] Integration with CF Hub mentorship platform

### Performance Optimizations
- [ ] Streaming responses for real-time feedback
- [ ] Message virtualization for long conversations
- [ ] Progressive file upload with progress bars
- [ ] Caching for repeated questions
- [ ] Service worker for offline support

## Troubleshooting

### Common Issues

**API Key Error**
```
Error: API configuration error. Please contact support.
```
Solution: Check that `NEXT_PUBLIC_GEMINI_API_KEY` is set in `.env.local`

**File Upload Fails**
- Check file size (must be < 10MB)
- Verify file type is supported
- Ensure file count doesn't exceed 5

**Message Limit Reached**
- Click "New Chat" to reset session
- Consider implementing backend session management

**Mobile Zoom on Input**
- Input font size is set to 16px to prevent zoom
- Check browser settings if issue persists

## Security Considerations

1. **API Key Protection**: Use environment variables, never commit keys
2. **File Validation**: Client-side and server-side validation needed
3. **Content Filtering**: Gemini safety filters enabled by default
4. **Rate Limiting**: Implement backend rate limiting for production
5. **User Data**: Consider privacy policy for uploaded resumes

## Testing

### Manual Testing Checklist
- [ ] Send text-only message
- [ ] Upload and send PDF resume
- [ ] Upload and send image
- [ ] Test file size limit (>10MB)
- [ ] Test file count limit (>5 files)
- [ ] Test message limit (50 messages)
- [ ] Test mobile responsiveness
- [ ] Test sidebar toggle on mobile
- [ ] Test "New Chat" functionality
- [ ] Verify conversation context preservation

### Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Safari (macOS/iOS)
- ✅ Firefox
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Credits
- **UI Inspiration**: ChatGPT, Claude
- **AI Provider**: Google Gemini AI
- **Framework**: Next.js 14, React 18
- **UI Library**: Ant Design
- **Icons**: Ant Design Icons

## License
Part of the CF Hub project. All rights reserved.
