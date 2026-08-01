import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Paperclip, Image, X, Sparkles, RefreshCw, FileText, CheckCircle2, User } from 'lucide-react';
import './CareerChatCanvas.css';

const DEFAULT_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: "👋 **Hi! I am RedJob AI Robot** — your executive career consultant powered by Mistral AI!\n\nI can analyze job description red flags, review your resume alignment, build a step-by-step interview roadmap, or draft salary negotiation scripts.\n\n*How can I help you land your dream role today?*",
    time: 'Just now'
  }
];

const QUICK_PROMPTS = [
  "🔍 Spot red flags in my job description",
  "📄 Audit my resume ATS match & missing skills",
  "🎯 Build my 4-stage interview preparation roadmap",
  "💰 Draft a salary negotiation email script"
];

const CareerChatCanvas = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedImage, setAttachedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText = inputQuery) => {
    const textToSend = typeof queryText === 'string' ? queryText.trim() : inputQuery.trim();
    if (!textToSend && !attachedFile && !attachedImage) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: textToSend,
      fileName: attachedFile?.name || null,
      imagePreview: attachedImage || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    const currentFile = attachedFile;
    const currentImage = attachedImage;
    setAttachedFile(null);
    setAttachedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.text })),
          documentText: currentFile?.content || null,
          imageBase64: currentImage || null
        })
      });

      const data = await response.json();
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply || "I'm analyzing your request. Ask me any job-related query!",
        modelUsed: data.modelUsed || 'Mistral Medium 3.5',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat API Error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: "🤖 **RedJob Robot Note**: I'm online! Ensure your Mistral key is configured in `.env`. Focus on quantifying achievements near the top of your resume and setting explicit salary expectations during initial recruiter screens!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        name: file.name,
        content: event.target.result
      });
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="chat-canvas-overlay" onClick={onClose}>
      <div className="chat-canvas-modal animate-scale-up" onClick={e => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="chat-canvas-header">
          <div className="chat-header-brand">
            <div className="chat-robot-avatar">
              <span className="chat-avatar-emoji">🤖</span>
            </div>
            <div>
              <h2 className="chat-header-title">REDJOB AI CAREER ASSISTANT</h2>
              <p className="chat-header-subtitle">Powered by Mistral AI • White Canvas Intelligence Engine</p>
            </div>
          </div>

          <button className="chat-close-btn" onClick={onClose} title="Close Canvas">
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="chat-canvas-body">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble-row ${msg.role}`}>
              <div className="chat-avatar">
                {msg.role === 'assistant' ? '🤖' : <User size={16} />}
              </div>

              <div className="chat-bubble-content glass-panel">
                {msg.fileName && (
                  <div className="chat-attached-file-tag">
                    <FileText size={14} /> Attached Document: <strong>{msg.fileName}</strong>
                  </div>
                )}

                {msg.imagePreview && (
                  <div className="chat-image-preview-box">
                    <img src={msg.imagePreview} alt="Uploaded Job Post" />
                  </div>
                )}

                <div className="chat-message-text">
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                <div className="chat-meta-bar">
                  <span>{msg.time}</span>
                  {msg.modelUsed && <span className="model-badge"><Sparkles size={10} /> {msg.modelUsed}</span>}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-row assistant">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble-content glass-panel typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="typing-text">Mistral AI Robot is analyzing your request...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="chat-quick-prompts">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button key={i} className="prompt-pill-btn" onClick={() => handleSendMessage(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        {/* Attachment Badges */}
        {(attachedFile || attachedImage) && (
          <div className="chat-attachments-bar">
            {attachedFile && (
              <span className="attachment-chip">
                <FileText size={14} /> {attachedFile.name}
                <X size={12} className="remove-chip" onClick={() => setAttachedFile(null)} />
              </span>
            )}
            {attachedImage && (
              <span className="attachment-chip">
                <Image size={14} /> Image Attached
                <X size={12} className="remove-chip" onClick={() => setAttachedImage(null)} />
              </span>
            )}
          </div>
        )}

        {/* Footer Input Form */}
        <div className="chat-canvas-footer">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".txt,.md,.json,.pdf,.doc,.docx"
            onChange={handleFileUpload} 
          />
          <input 
            type="file" 
            ref={imageInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleImageUpload} 
          />

          <button className="attach-btn" onClick={() => fileInputRef.current?.click()} title="Upload Resume or Document">
            <Paperclip size={18} />
          </button>
          <button className="attach-btn" onClick={() => imageInputRef.current?.click()} title="Upload Screenshot / Image">
            <Image size={18} />
          </button>

          <input 
            type="text" 
            className="chat-input-field" 
            placeholder="Ask RedJob AI Robot about resumes, job red flags, or interview strategy..." 
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          />

          <button className="send-msg-btn" onClick={() => handleSendMessage()} disabled={isTyping}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerChatCanvas;
