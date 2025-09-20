import React, { useState } from 'react';
import { SendIcon } from './IconComponents';

interface ChatInputProps {
  onSendMessage: (input: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about stocks, crypto, forex..."
        className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-slate-200 placeholder-slate-500"
        disabled={isLoading}
        aria-label="Chat input"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="bg-teal-600 text-white p-3 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-all duration-200"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
};