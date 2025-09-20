import React from 'react';
import { Message } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface ChatMessageProps {
  message: Message;
}

// Fix: Implemented the ChatMessage component to correctly render user and bot messages, resolving the module not found and other related errors.
export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start space-x-4 ${isBot ? '' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0">
          <BotIcon />
        </div>
      )}
      <div className={`p-4 rounded-lg max-w-2xl ${isBot ? 'bg-gray-800' : 'bg-teal-600 text-white'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        {/* Source links are no longer displayed to the user */}
      </div>
      {!isBot && (
        <div className="flex-shrink-0">
          <UserIcon />
        </div>
      )}
    </div>
  );
};
