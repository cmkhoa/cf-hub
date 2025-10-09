"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Upload, message as antMessage, Spin, Avatar, Tooltip, Modal } from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FileImageOutlined,
  RobotOutlined,
  UserOutlined,
  PlusOutlined,
  MenuOutlined,
  DownloadOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useLang } from "@/contexts/langprov";
import HeaderComponent from "@/components/header/header";
import { generateCareerGuidance } from '@/services/geminiService';
import './chatroom.css';
import Layout from 'antd/es/layout/layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import sanitizeHtml from 'sanitize-html';
import PromptSuggestionsRow from '@/components/Chatbot/PromptSuggestionsRow';

const { TextArea } = Input;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_SESSION = 5;
const MAX_MESSAGES_PER_SESSION = 50;

const ChatRoom = () => {
  const { t } = useLang();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [ready, setReady] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track unsaved changes
  useEffect(() => {
    if (messages.length > 1) {
      setHasUnsavedChanges(true);
    }
  }, [messages]);

  // Warn before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved conversation history. Are you sure you want to leave? Consider saving your conversation first.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: t('chatroom.greeting'),
      timestamp: new Date()
    }]);
    setReady(true);
  }, [t]);

  // Handle file attachment
  const handleFileChange = (info) => {
    const { file } = info;
    
    // Check file count limit
    if (attachedFiles.length >= MAX_FILES_PER_SESSION) {
      antMessage.error(`You can only upload up to ${MAX_FILES_PER_SESSION} files per session`);
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      antMessage.error('File size must be less than 10MB');
      return false;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      antMessage.error('Please upload PDF, DOCX, or image files only');
      return false;
    }

    // Add file to attached files
    const newFile = {
      uid: file.uid,
      name: file.name,
      type: file.type,
      size: file.size,
      file: file
    };

    setAttachedFiles(prev => [...prev, newFile]);
    antMessage.success(`${file.name} attached`);
    return false; // Prevent auto upload
  };

  // Remove attached file
  const removeFile = (uid) => {
    setAttachedFiles(prev => prev.filter(f => f.uid !== uid));
  };

  // Send message with Gemini API (supports override text/files for suggestion clicks)
  const sendMessage = async (overrideText = null, overrideFiles = null) => {
    const text = (overrideText ?? inputValue).trim();
    const filesToSend = overrideFiles ?? attachedFiles;

    if (!text && filesToSend.length === 0) {
      antMessage.warning(t('chatroom.warningMessage'));
      return;
    }

    // Check message limit
    if (messages.length >= MAX_MESSAGES_PER_SESSION) {
      antMessage.error(t('chatroom.limitReached'));
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      files: [...filesToSend],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = text;
    const currentFiles = [...filesToSend];
    setInputValue('');
    setAttachedFiles([]);
    setLoading(true);

    try {
      // Call Gemini API with conversation history for context
      const aiResponse = await generateCareerGuidance(
        currentInput,
        currentFiles,
        [...messages, userMessage]
      );

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSessionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: error.message || t('chatroom.errorResponse'),
        error: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      antMessage.error(t('chatroom.failedResponse'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle suggestion bubble click: send immediately
  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };

  // Get translated suggestions
  const suggestions = [
    t('chatroom.suggestions.workshops'),
    t('chatroom.suggestions.mentor'),
    t('chatroom.suggestions.opportunities')
  ];

  // Save conversation
  const saveConversation = () => {
    const conversationText = messages
      .map(msg => {
        const time = msg.timestamp.toLocaleString();
        const role = msg.role === 'user' ? 'You' : 'Assistant';
        return `[${time}] ${role}:\n${msg.content}\n`;
      })
      .join('\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CF-Hub-Conversation-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setHasUnsavedChanges(false);
    antMessage.success(t('chatroom.conversationSaved'));
  };

  // Clear chat
  const clearChat = () => {
    Modal.confirm({
      title: t('chatroom.clearConfirmTitle'),
      content: t('chatroom.clearConfirmMessage'),
      okText: t('chatroom.clearButton'),
      okType: 'danger',
      cancelText: t('chatroom.cancelButton'),
      onOk: () => {
        setMessages([{
          id: Date.now(),
          role: 'assistant',
          content: t('chatroom.chatCleared'),
          timestamp: new Date()
        }]);
        setSessionCount(0);
        setHasUnsavedChanges(false);
        antMessage.success(t('chatroom.chatClearedSuccess'));
      }
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (type) => {
    if (type.includes('image')) return <FileImageOutlined />;
    return <FileTextOutlined />;
  };

  return (
    <Layout>
      <HeaderComponent current="chatroom" />
      <div className="chatroom-container">
        {/* Sidebar */}
        <div className={`chatroom-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>{t('chatroom.title')}</h2>
            <Button
              icon={<SaveOutlined />}
              onClick={saveConversation}
              className="new-chat-btn"
              style={{ marginBottom: 8 }}
            >
              {t('chatroom.saveChat')}
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={clearChat}
              className="new-chat-btn"
            >
              {t('chatroom.newChat')}
            </Button>
          
          <div className="session-info">
            <p className="info-label">{t('chatroom.sessionStats')}</p>
            <div className="stat-item">
              <span>{t('chatroom.messages')}: {messages.length}/{MAX_MESSAGES_PER_SESSION}</span>
            </div>
            <div className="stat-item">
              <span>{t('chatroom.files')}: {attachedFiles.length}/{MAX_FILES_PER_SESSION}</span>
            </div>
          </div>

          <div className="capabilities-section">
            <p className="info-label capabilities-label">{t('chatroom.helpWith')}</p>
            <ul className="capabilities-list">
              <li>📄 {t('chatroom.capabilities.resume')}</li>
              <li>🎯 {t('chatroom.capabilities.career')}</li>
              <li>💼 {t('chatroom.capabilities.interview')}</li>
              <li>📚 {t('chatroom.capabilities.skills')}</li>
              <li>🔍 {t('chatroom.capabilities.jobSearch')}</li>
              <li>📊 {t('chatroom.capabilities.insights')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chatroom-main">
        <Button
          icon={<MenuOutlined />}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="menu-toggle"
        />

        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.role}`}>
              <Avatar 
                icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                className={`message-avatar ${msg.role}`}
              />
              <div className={`message-bubble ${msg.role} ${msg.error ? 'error' : ''}`}>
                <div className="message-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      ),
                      code: ({ inline, className, children, ...props }) => (
                        <code className={className} {...props}>{children}</code>
                      ),
                    }}
                  >
                    {sanitizeHtml(String(msg.content || ''), {
                      allowedTags: [
                        'b','strong','i','em','u','sub','sup','code','pre','a','ul','ol','li','p','br','span'
                      ],
                      allowedAttributes: {
                        a: ['href','title','target','rel'],
                        span: ['style']
                      },
                      allowedSchemes: ['http','https','mailto']
                    })}
                  </ReactMarkdown>
                </div>
                
                {/* Display attached files */}
                {msg.files && msg.files.length > 0 && (
                  <div className="message-files">
                    {msg.files.map(file => (
                      <div key={file.uid} className="file-chip">
                        {getFileIcon(file.type)}
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Suggestion bubbles: show when only greeting exists or after assistant reply */}
          {ready && messages.length <= 1 && !loading && (
            <PromptSuggestionsRow 
              onSuggestionClick={handleSuggestionClick}
              suggestions={suggestions}
            />
          )}
          
          {loading && (
            <div className="message-wrapper assistant">
              <Avatar icon={<RobotOutlined />} className="message-avatar assistant" />
              <div className="message-bubble assistant typing">
                <Spin size="small" />
                <span style={{ marginLeft: 10 }}>{t('chatroom.thinking')}</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          {/* Attached files preview */}
          {attachedFiles.length > 0 && (
            <div className="attached-files-preview">
              {attachedFiles.map(file => {
                // Create preview URL for images
                const isImage = file.type.includes('image');
                const previewUrl = isImage ? URL.createObjectURL(file.file) : null;
                
                return (
                  <div key={file.uid} className="attached-file-item">
                    {getFileIcon(file.type)}
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeFile(file.uid)}
                    />
                    
                    {/* File preview tooltip on hover */}
                    <div className="file-preview-tooltip">
                      {isImage && previewUrl ? (
                        <img src={previewUrl} alt={file.name} />
                      ) : (
                        <div className="preview-text">
                          📄 {file.name}
                          <br />
                          {formatFileSize(file.size)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="input-wrapper">
            <Upload
              beforeUpload={handleFileChange}
              showUploadList={false}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              disabled={attachedFiles.length >= MAX_FILES_PER_SESSION}
            >
              <Tooltip title={t('chatroom.attachFile')}>
                <Button
                  icon={<PaperClipOutlined />}
                  className="attach-btn"
                  disabled={attachedFiles.length >= MAX_FILES_PER_SESSION}
                />
              </Tooltip>
            </Upload>

            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chatroom.placeholder')}
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="chat-input"
              disabled={loading}
            />

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              loading={loading}
              disabled={!inputValue.trim() && attachedFiles.length === 0}
              className="send-btn"
            />
          </div>

          <div className="input-footer">
            <span className="footer-text">
              {t('chatroom.disclaimer')}
            </span>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ChatRoom;
