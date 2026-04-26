"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Wallet, Sparkles, User, Bot } from 'lucide-react';

export default function ThinkMathApp() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Namaste! I am ThinkMath.ai. Shall we look past the numbers and see the story your math problem is trying to tell?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const systemPrompt = `You are the 'Advaitian Socratic Mentor' for ThinkMath.ai. 
    1. NEVER give the numerical answer directly.
    2. Use 'Narrative Physics': Explain math as a story of balance and patterns.
    3. Use Socratic questioning to lead the student (age 6-12) to the answer.`;

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentInput = input;
    setInput('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey!);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt 
      });
      
      const result = await model.generateContent(currentInput);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'bot', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "The connection to the lab is fuzzy. Try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 font-sans">
      <header className="px-6 py-4 border-b border-purple-900/30 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          <h1 className="text-lg font-semibold">ThinkMath<span className="text-purple-500">.ai</span></h1>
        </div>
        <a href="https://paypal.me/vasumathiik" target="_blank" className="flex items-center gap-2 bg-zinc-900 border border-purple-500/30 px-4 py-2 rounded-full text-xs transition-all hover:bg-purple-500/10">
          <Wallet size={14} className="text-purple-400" /> Support
        </a>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-purple-600' : 'bg-zinc-800 border border-purple-900/50'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-purple-400" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-zinc-900/50 text-zinc-300 border border-purple-900/20 rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="text-purple-500 animate-pulse text-xs pl-12">Thinking...</div>}
      </main>

      <footer className="p-4 bg-[#050505] border-t border-purple-900/20">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/50" placeholder="Ask your math story..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
          <button onClick={handleSend} className="bg-purple-600 p-4 rounded-2xl hover:bg-purple-500"><Send size={20} /></button>
        </div>
      </footer>
    </div>
  );
}
