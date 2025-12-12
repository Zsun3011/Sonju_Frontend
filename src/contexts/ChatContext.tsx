// src/contexts/ChatContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Personality } from '../types/ai';
import { Chat } from '../types/chat';

interface ChatContextType {
  // 프롬프트 관련
  currentPrompt: Personality;
  setCurrentPrompt: (prompt: Personality) => void;
  
  // 채팅 목록 관련
  chats: Chat[];
  currentChatId: string | null;
  selectChat: (chatId: string) => void;
  createChat: (title: string) => void;
  deleteChats: (chatIds: string[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [currentPrompt, setCurrentPrompt] = useState<Personality>(Personality.FRIENDLY);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  /**
   * 채팅 선택
   */
  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  /**
   * 새 채팅 생성
   */
  const createChat = (title: string) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: title,
      date: new Date(),
      lastMessage: '',
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  /**
   * 채팅 삭제
   */
  const deleteChats = (chatIds: string[]) => {
    setChats((prev) => prev.filter((chat) => !chatIds.includes(chat.id)));
    
    // 현재 선택된 채팅이 삭제되었다면 초기화
    if (currentChatId && chatIds.includes(currentChatId)) {
      setCurrentChatId(null);
    }
  };

  const deleteAllChats = () => {
    setChats([]);
    setCurrentChat(null);
  };

  return (
    <ChatContext.Provider
      value={{
        currentPrompt,
        setCurrentPrompt,
        chats,
        currentChatId,
        selectChat,
        createChat,
        deleteChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

