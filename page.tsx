// Save this as 'page.tsx' in a Next.js project
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ThinkMathApp() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm ThinkMath.ai. Ready to explore the physics of your math problems?" }
  ]);
  const [loading, setLoading] = useState(false);

  // YOUR SYSTEM BLUEPRINT (The Advaitian Mentor)
  const systemPrompt = `You are the Advaitian Socratic Mentor for ThinkMath.ai. 
  Follow the 'Narrative Architect' framework. Never give the answer directly. 
  Use 'Narrative Physics' to explain the 'why' before the 'how'. 
  Be encouraging, deep, and focus on mathematical thinking for a 6-12 year old audience.`;

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemPrompt });
      
      const result = await model.generateContent(input);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'bot', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "The connection to the lab is fuzzy. Try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="p-4 border-b border-purple-900/50 flex justify-between items-center bg-zinc-900/50">
        <h1 className="text-xl font-bold tracking-tight text-purple-400">ThinkMath.ai</h1>
        <a 
          href="https://paypal.me/vasumathiik" 
          target="_blank" 
          className="bg-purple-600 hover:bg-purple-500 text-[12px] px-4 py-1 rounded-full transition-all"
        >
          Support
        </a>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              m.role === 'user' ? 'bg-purple-700 text-white' : 'bg-zinc-800 text-zinc-200 border border-purple-900/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-zinc-500 animate-pulse text-sm">Thinking...</div>}
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-zinc-900/80 backdrop-blur-md">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
            placeholder="Describe your math problem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="bg-purple-600 p-3 rounded-xl hover:scale-105 transition-transform"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
