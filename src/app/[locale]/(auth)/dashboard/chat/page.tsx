'use client';

import { useState } from 'react';

import Chat from '@/components/Chat';
import ChatHistory from '@/components/ChatHistory';

export default function Page() {
  const [chatId, setChatId] = useState<string>(() =>
    Date.now().toString(),
  );

  const handleNewChat = () => {
    setChatId(Date.now().toString());
  };

  return (
    <div className="flex h-screen">
      <ChatHistory onSelect={setChatId} onNewChat={handleNewChat} />
      <div className="flex-1">
        <Chat chatId={chatId} />
      </div>
    </div>
  );
}
