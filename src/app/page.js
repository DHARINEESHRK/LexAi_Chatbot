"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Plus, Copy, RefreshCw, ThumbsUp, ThumbsDown, Scale, ChevronDown, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from '@/styles/Chat.module.css';

const EXAMPLE_PROMPTS = [
  "Explain bail in simple terms",
  "What are the rights of an arrested person?",
  "What is an FIR?",
  "Explain anticipatory bail",
  "What is the difference between civil and criminal law?",
  "Explain this legal provision simply"
];

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Generate initial conversation ID on mount
    setConversationId(generateId());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(generateId());
    setInput('');
    setError('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
    }
  };

  const handleSubmit = async (e, queryOverride) => {
    e?.preventDefault();
    const query = queryOverride || input.trim();
    if (!query || isLoading) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
    }
    setError('');

    // Add user message
    const newUserMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          conversation_id: conversationId
        }),
      });

      if (!response.ok) {
        throw new Error('LexAI couldn\'t connect right now.');
      }

      const data = await response.json();
      
      const newAssistantMessage = {
        role: 'assistant',
        content: data.answer || "I'm sorry, I couldn't generate an answer.",
        sources: data.sources || [],
        validationStatus: data.validation_status || null
      };

      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (err) {
      console.error(err);
      setError('LexAI couldn\'t connect right now.');
      // Remove the optimistic user message if we want, or just show error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Scale size={24} color="var(--primary)" />
          LexAI
          <span className={styles.subtitle}>AI Legal Assistant</span>
        </div>
        <button className={styles.newChatBtn} onClick={startNewChat}>
          <Plus size={16} /> New Chat
        </button>
      </header>

      {/* Main Chat Area */}
      <main className={styles.main}>
        {messages.length === 0 ? (
          <div className={styles.welcomeContainer}>
            <Scale size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h1 className={styles.welcomeTitle}>Understand Law. Ask LexAI.</h1>
            <p className={styles.welcomeSubtitle}>An AI assistant for understanding Indian law.</p>
            
            <div className={styles.suggestionsGrid}>
              {EXAMPLE_PROMPTS.map((prompt, idx) => (
                <button 
                  key={idx} 
                  className={styles.suggestionCard}
                  onClick={() => handleSubmit(null, prompt)}
                >
                  <span className={styles.suggestionText}>{prompt}</span>
                  <Send size={14} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messagesWrapper}>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} onCopy={() => copyToClipboard(msg.content)} />
            ))}
            
            {isLoading && (
              <div className={`${styles.messageRow} ${styles.assistant}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.assistantHeader}>
                    <Scale size={18} /> LexAI
                  </div>
                  <div className={styles.loadingIndicator}>
                    LexAI is thinking
                    <div style={{display: 'flex', gap: '2px', marginLeft: '4px'}}>
                      <div className={styles.dot}></div>
                      <div className={styles.dot}></div>
                      <div className={styles.dot}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className={`${styles.messageRow} ${styles.assistant}`}>
                 <div className={styles.messageBubble} style={{color: 'var(--danger)'}}>
                    <AlertCircle size={16} style={{display:'inline', marginRight: '8px'}}/>
                    {error}
                    <div style={{marginTop: '1rem'}}>
                      <button className={styles.actionBtn} onClick={() => handleSubmit(null, messages[messages.length-1].content)}>
                        <RefreshCw size={14} /> Retry
                      </button>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Footer / Input Area */}
      <footer className={styles.footer}>
        <div className={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder="Ask LexAI anything about law..."
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <button 
            className={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
          >
            <Send size={16} />
          </button>
        </div>
        <div className={styles.disclaimer}>
          LexAI provides legal information for educational purposes and is not a substitute for professional legal advice.
        </div>
      </footer>
    </div>
  );
}

// Sub-component for individual messages
function ChatMessage({ message, onCopy }) {
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.messageRow} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.messageBubble}>
        {!isUser && (
          <div className={styles.assistantHeader}>
            <Scale size={18} /> LexAI
            
            {message.validationStatus === 'REVIEW_REQUIRED' && (
              <span className={`${styles.validationBadge} ${styles.review}`} title="Review Recommended">
                <AlertCircle size={12} /> Review Recommended
              </span>
            )}
            {message.validationStatus === 'VALIDATED' && (
              <span className={`${styles.validationBadge} ${styles.validated}`} title="Validated">
                <CheckCircle2 size={12} /> Validated
              </span>
            )}
          </div>
        )}

        <div className="markdown-body">
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className={styles.sourcesContainer}>
            <div 
              className={styles.sourcesSummary} 
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
            >
              {sourcesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              Sources ({message.sources.length})
            </div>
            {sourcesExpanded && (
              <div className={styles.sourcesList}>
                {message.sources.map((source, i) => (
                  <span key={i} className={styles.sourceTag}>{source}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {!isUser && (
          <div className={styles.messageActions}>
            <button className={styles.actionBtn} onClick={onCopy} title="Copy">
              <Copy size={14} /> Copy
            </button>
            <button className={styles.actionBtn} title="Regenerate">
              <RefreshCw size={14} /> Regenerate
            </button>
            <button className={styles.actionBtn} title="Helpful">
              <ThumbsUp size={14} />
            </button>
            <button className={styles.actionBtn} title="Not Helpful">
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
