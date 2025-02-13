'use client';

import { useEffect, useState } from 'react';

export default function ChatHistory({
  onSelect,
  onNewChat,
}: {
  onSelect: (chatId: string) => void;
  onNewChat: () => void;
}) {
  const [chats, setChats] = useState<{ id: string; preview: string }[]>([]);

  // Function to load chat history from sessionStorage
  const loadChats = () => {
    const savedChats = Object.keys(sessionStorage)
      .filter(key => key.startsWith('chat-'))
      .map((key) => {
        const messages = JSON.parse(sessionStorage.getItem(key) || '[]');
        return {
          id: key.replace('chat-', ''),
          preview: messages.length > 0 && messages[0]?.text
            ? messages[0].text.slice(0, 20)
            : 'New Chat',
        };
      });

    // Sort chats by id to ensure that chats appear in the correct order
    const orderedChats = savedChats.sort((a, b) => b.id.localeCompare(a.id)); // Ensures the latest chat appears first
    setChats(orderedChats); // Set the chats state to the ordered list
  };

  useEffect(() => {
    loadChats(); // Load chats on mount

    // Listen for storage updates to update the chat list dynamically
    const handleStorageChange = () => {
      loadChats();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNewChat = () => {
    onNewChat();
    loadChats(); // Update chat history immediately
  };

  const handleDeleteChat = (chatId: string) => {
    // Remove the chat from sessionStorage
    sessionStorage.removeItem(`chat-${chatId}`);
    loadChats(); // Update chat list after deletion
  };

  return (
    <div className="flex h-full w-80 flex-col rounded-lg bg-white bg-opacity-90 p-5 text-gray-800 shadow-xl backdrop-blur-lg">
      <h2 className="mb-5 text-center text-2xl font-semibold">Chat History</h2>
      <button
        onClick={handleNewChat}
        className="mb-4 w-full rounded-lg bg-blue-500 p-3 font-semibold text-white transition-transform duration-300 hover:bg-blue-600"
      >
        + New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        <ul>
          {chats.map((chat, index) => (
            <li
              key={chat.id}
              className={`relative mb-2 overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${
                index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-50' // Alternate colors for odd/even chats
              }`}
            >
              <button
                className="w-full rounded-lg p-3 text-left transition-all duration-200 hover:bg-gray-300"
                onClick={() => onSelect(chat.id)}
              >
                <span className="text-lg text-gray-900">
                  {chat.preview}
                  {' '}
                  <span>...</span>
                </span>
              </button>
              {/* Trash Icon in the top-right corner */}
              <button
                onClick={() => handleDeleteChat(chat.id)}
                className="absolute right-2 top-2 text-gray-500 transition duration-200 hover:text-red-500"
              >
                {/* Trash Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6h4M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2M4 6h16M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6H5z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
