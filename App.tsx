import React, { useState, useRef, useEffect } from 'react';
// Fix: Corrected import paths for components, services, and types.
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { getFinancialInsight } from './services/geminiService';
import { Message } from './types';
import { BotIcon } from './components/IconComponents';

// Fix: Implement the main App component.
function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Greet the user with an initial message
    setMessages([
      {
        id: 'initial-bot-message',
        text: "Hello! I'm your financial assistant. How can I help you with stocks, crypto, or forex today?",
        sender: 'bot'
      }
    ]);
  }, []);

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const { text, sources } = await getFinancialInsight(input);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: text,
        sender: 'bot',
        sources: sources,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Sorry, something went wrong. Please try again.",
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 text-white h-screen flex flex-col font-sans">
      <header className="bg-gray-900 p-4 border-b border-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-center text-teal-400 tracking-wider">
          Fin-Advisor AI
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <BotIcon />
              </div>
              <div className="p-4 rounded-lg bg-gray-800 flex items-center justify-center space-x-1.5 h-[52px]" aria-live="polite" aria-label="Bot is thinking">
                <span className="sr-only">Thinking...</span>
                <div className="h-2 w-2 bg-slate-400 rounded-full dot dot-1"></div>
                <div className="h-2 w-2 bg-slate-400 rounded-full dot dot-2"></div>
                <div className="h-2 w-2 bg-slate-400 rounded-full dot dot-3"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="p-6 bg-gray-950 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}

export default App;