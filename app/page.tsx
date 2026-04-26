"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Wallet, Sparkles, User, Bot } from 'lucide-react';

export default function ThinkMathApp() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Namaste! I am ThinkMath.ai. Shall we explore the story behind your math problem?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const currentInput = input;
    setInput('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'bot', text: "The lab's key is missing. Please check the Environment Variables." }]);
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are an Advaitian Socratic Mentor. Never give answers directly. Use Narrative Physics to explain math." 
      });
      
      const result = await model.generateContent(currentInput);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'bot', text: response.text() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "The narrative flow was interrupted. Shall we try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 font-sans">
      <header className="px-6 py-4 border-b border-purple-900/30 flex justify-between items-center bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          <h1 className="text-lg font-semibold tracking-tight text-white">ThinkMath<span className="text-purple-500">.ai</span></h1>
        </div>
        <a href="https://paypal.me/vasumathiik" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-zinc-900 border border-purple-500/30 px-4 py-2 rounded-full text-xs hover:bg-purple-500/10 transition-all">
          <Wallet size={14} className="text-purple-400" /> Support
        </a>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none shadow-lg' : 'bg-zinc-900/50 text-zinc-300 border border-purple-900/20 rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="text-purple-500 animate-pulse text-xs pl-4">Connecting to the Thinking Lab...</div>}
      </main>

      <footer className="p-4 border-t border-purple-900/20 bg-[#050505]">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input 
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all" 
            placeholder="Describe your math problem..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
          />
          <button onClick={handleSend} className="bg-purple-600 p-4 rounded-2xl hover:bg-purple-500 transition-all active:scale-95">
            <Send size={20} className="text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
}
