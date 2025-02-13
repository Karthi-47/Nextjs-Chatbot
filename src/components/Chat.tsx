'use client';

import { useEffect, useState } from 'react';

export default function Chat({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  // Load messages from sessionStorage when chatId changes
  useEffect(() => {
    const savedChats = sessionStorage.getItem(`chat-${chatId}`);
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
    } else {
      setMessages([]);
    }
  }, [chatId]);

  // Handle sending messages
  const sendMessage = () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = { sender: 'user', text: input };
    const aiResponse = { sender: 'ai', text: 'This is a default AI response.' };

    const newMessages = [...messages, userMessage, aiResponse];
    setMessages(newMessages);
    sessionStorage.setItem(`chat-${chatId}`, JSON.stringify(newMessages));

    setInput(''); // Clear input
  };

  // Handle "Enter" key to send messages
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
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs rounded-lg p-3 transition-all duration-300 ease-in-out ${
              msg.sender === 'user'
                ? 'animate__animated animate__fadeInUp ml-auto bg-blue-500 text-white'
                : 'animate__animated animate__fadeInUp mr-auto bg-gray-700 text-white'
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
          className="flex-1 rounded-md bg-gray-700 p-3 text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 rounded-md bg-green-500 px-4 py-2 transition-all duration-200 ease-in-out hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
