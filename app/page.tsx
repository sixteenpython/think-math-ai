"use client";
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Sparkles } from 'lucide-react';

export default function ThinkMathApp() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', text: "Namaste! I am ThinkMath.ai. Shall we explore the story behind your math problem?" }]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const currentInput = input;
    setInput('');

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are an Advaitian Socratic Mentor. Never give answers directly. Use Narrative Physics to explain math patterns." 
      });
      const result = await model.generateContent(currentInput);
      setMessages(prev => [...prev, { role: 'bot', text: result.response.text() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "The lab is resetting. Try again?" }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <header className="p-4 border-b border-zinc-800 flex items-center gap-2">
        <Sparkles className="text-purple-500" /> <h1 className="font-bold">ThinkMath.ai</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[80%] ${m.role === 'user' ? 'bg-purple-700 ml-auto' : 'bg-zinc-900'}`}>{m.text}</div>
        ))}
      </main>
      <footer className="p-4 border-t border-zinc-800 flex gap-2">
        <input className="flex-1 bg-zinc-900 p-3 rounded-lg outline-none" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask a math story..." />
        <button onClick={handleSend} className="bg-purple-600 p-3 rounded-lg"><Send size={20} /></button>
      </footer>
    </div>
  );
}
