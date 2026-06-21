import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  BrainCircuit,
  Send,
  Briefcase,
  Bot,
  User,
  HelpCircle,
  FileText,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Placement Assistant. I can guide you on optimizing your resume for ATS, planning interview preparation steps, and navigating placement eligibility. Ask me anything!',
      createdAt: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [thinking, setThinking] = useState(false);

  const chatEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : 'https://college-placement-portal-fvu8.onrender.com/api');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);

    try {
      const { data } = await axios.post(`${API_URL}/ai/chat`, { message: textToSend });
      
      const botMsg = {
        sender: 'bot',
        text: data.reply,
        createdAt: new Date(),
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Oops! I encountered an error connecting to the advice servers. Please try again.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    handleSendMessage(text);
  };

  // Chips for instant questions
  const queryChips = [
    { text: 'Optimize resume for ATS', icon: FileText },
    { text: 'Technical interview roadmap', icon: TrendingUp },
    { text: 'Placement eligibility details', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-brand-500" />
          AI Placement Advisor
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chat with the virtual assistant for career guidance, resume suggestions, and drive FAQs.
        </p>
      </div>

      <div className="glass-panel border border-white/20 dark:border-slate-800/80 rounded-3xl h-[450px] overflow-hidden flex flex-col justify-between">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2.5 bg-slate-50/20 dark:bg-slate-900/10 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white leading-none">Success Career AI</h3>
            <span className="text-[9px] text-emerald-500 font-semibold block mt-1">Active Chat Assistant</span>
          </div>
        </div>

        {/* Scrollable chat body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/10 dark:bg-slate-900/5">
          {messages.map((msg, idx) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={idx} className={`flex gap-3.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0 border border-brand-500/20">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] p-4 rounded-2xl shadow-sm text-xs leading-relaxed break-words whitespace-pre-line ${
                    isBot
                      ? 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-205 rounded-tl-none'
                      : 'bg-brand-500 text-white rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-805 flex items-center justify-center font-bold text-xs shrink-0 text-slate-600 dark:text-slate-300">
                    U
                  </div>
                )}
              </div>
            );
          })}
          
          {thinking && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/20 dark:bg-slate-900/10 shrink-0 space-y-3">
          {/* Query Suggestion Chips */}
          <div className="flex flex-wrap gap-2">
            {queryChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.text)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-brand-500" />
                  {chip.text}
                </button>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Ask anything about technical interviews, ATS scoring, etc..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md cursor-pointer transition-colors"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
