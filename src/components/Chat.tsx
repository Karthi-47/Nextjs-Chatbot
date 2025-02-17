'use client';

import { useEffect, useState } from 'react';

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
};

// Utility function to generate a UUID
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function Chat({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isNewChat, setIsNewChat] = useState(true);

  useEffect(() => {
    const savedChats = sessionStorage.getItem(`chat-${chatId}`);
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
      setIsNewChat(false);
    } else {
      setMessages([]);
      setIsNewChat(true);
    }
  }, [chatId]);

  useEffect(() => {
    if (messages.length > 0 && isNewChat) {
      sessionStorage.setItem(`chat-${chatId}`, JSON.stringify(messages));
      window.dispatchEvent(new Event('storage'));
      setIsNewChat(false);
    }
  }, [messages, chatId, isNewChat]);

  const sendMessage = () => {
    if (!input.trim()) {
      return;
    }

    const userMessage: Message = {
      id: generateUUID(), // Use the utility function
      sender: 'user',
      text: input,
      timestamp: Date.now(),
    };

    const aiResponse: Message = {
      id: generateUUID(), // Use the utility function
      sender: 'ai',
      text: 'This is a default AI response.',
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage, aiResponse];
    setMessages(newMessages);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* Chat messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`mx-1 mt-12 max-w-xs rounded-lg p-3 transition-all duration-300 ease-in-out ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-700 text-white'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Chat input */}
      <div className="flex items-center rounded-t-md bg-gray-800 p-4 shadow-lg">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-md bg-gray-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 rounded-md bg-green-500 px-4 py-2 hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
