"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Wallet, Sparkles, User, Bot } from 'lucide-react';

export default function ThinkMathApp() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Namaste! I am ThinkMath.ai, your Advaitian Mentor. Shall we look past the numbers and see the story your math problem is trying to tell?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // YOUR ADVATIAN SYSTEM BLUEPRINT
  const systemPrompt = `
    You are the 'Advaitian Socratic Mentor' for ThinkMath.ai. 
    CORE RULES:
    1. NEVER give the numerical answer directly.
    2. Use 'Narrative Physics': Explain math as a story of forces, balance, and patterns.
    3. Use Socratic questioning: Lead the student (age 6-12) to the answer by asking 'What do you notice?' 
    4. Maintain a premium, encouraging, and slightly philosophical tone.
  `;

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentInput = input;
    setInput('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key Missing");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt 
      });
      
      const result = await model.generateContent(currentInput);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'bot', text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "The connection to the lab is slightly out of sync. Please try your question again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="px-6 py-4 border-b border-purple-900/30 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">ThinkMath<span className="text-purple-500">.ai</span></h1>
        </div>
        <a 
          href="https://paypal.me/vasumathiik" 
          target="_blank" 
          className="flex items-center gap-2 bg-zinc-900 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 text-zinc-300 text-xs font-medium px-4 py-2 rounded-full transition-all duration-300"
        >
          <Wallet size={14} className="text-purple-400" />
          Support
        </a>
      </header>

      {/* Chat Space */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-purple-600' : 'bg-zinc-800 border border-purple-900/50'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-purple-400" />}
              </div>
              <div className={`p-4 rounded-2xl leading-relaxed text-sm md:text-base ${
                m.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none shadow-lg' 
                : 'bg-zinc-900/50 text-zinc-300 border border-purple-900/20 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900/50 border border-purple-900/20 p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input Console */}
      <footer className="p-4 md:p-6 bg-[#050505] border-t border-purple-900/20">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
          <input 
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-600"
            placeholder="Describe the math story you're stuck on..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 p-4 rounded-2xl hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-center text-zinc-600 mt-4 uppercase tracking-widest">
          Vriddhi ConSaaS • Powered by Gemini 1.5 Flash
        </p>
      </footer>
    </div>
  );
}
