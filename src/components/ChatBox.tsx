'use client';

import { useEffect, useState } from 'react';

import type { Message } from '@/libs/types';

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // Load messages from session storage
  useEffect(() => {
    const savedChats = sessionStorage.getItem('chat-history');
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
    }
  }, []);

  // Save messages to session storage
  useEffect(() => {
    sessionStorage.setItem('chat-history', JSON.stringify(messages));
  }, [messages]);

  // Handle sending messages
  const sendMessage = () => {
    if (!input.trim()) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    const botReply: Message = {
      id: crypto.randomUUID(),
      text: 'Hello! I am a default AI response.',
      sender: 'bot',
      timestamp: Date.now(),
    };

    setMessages([...messages, userMessage, botReply]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col rounded-lg bg-gray-900 p-4 text-white">
      <div className="mb-2 flex-1 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`my-1 rounded p-2 ${msg.sender === 'user' ? 'ml-auto bg-blue-500' : 'mr-auto bg-gray-700'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center border-t border-gray-700 p-2">
        <input
          type="text"
          className="flex-1 rounded-md bg-gray-800 p-2 text-white"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="ml-2 rounded-md bg-blue-600 px-4 py-2">
          Send
        </button>
      </div>
    </div>
  );
}
