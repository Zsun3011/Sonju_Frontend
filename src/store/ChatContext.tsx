import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chat, Message, PromptSettings } from '../types/chat';
import { chatAPI } from '../api/chat';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  promptSettings: PromptSettings;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string, isVoice?: boolean) => Promise<void>;
  toggleFavorite: (chatId: string) => void;
  updatePromptSettings: (settings: PromptSettings) => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [promptSettings, setPromptSettings] = useState<PromptSettings>({
    personality: '다정한',
    tone: '존댓말',
    emotionalExpression: '적당히',
    interests: ['뉴스', '운동'],
  });
  const [loading, setLoading] = useState(false);

  // 채팅 목록 로드
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const chatList = await chatAPI.getChatList();
      setChats(chatList);
    } catch (error) {
      console.error('채팅 목록 로드 실패:', error);
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: '새 채팅',
      messages: [],
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const sendMessage = async (content: string, isVoice: boolean = false) => {
    if (!currentChat) {
      createNewChat();
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
      isVoice,
    };

    // UI 업데이트
    const updatedMessages = [...(currentChat?.messages || []), userMessage];
    setCurrentChat(prev => prev ? { ...prev, messages: updatedMessages } : null);

    setLoading(true);
    try {
      // ChatGPT API 호출
      const response = await chatAPI.sendMessage(
        updatedMessages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
        promptSettings
      );

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      
      // 채팅 업데이트
      const updatedChat: Chat = {
        ...currentChat!,
        messages: finalMessages,
        title: currentChat?.messages.length === 0 ? content.slice(0, 20) : currentChat!.title,
        updatedAt: new Date(),
      };

      setCurrentChat(updatedChat);
      setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));

      // 저장
      await chatAPI.saveChatHistory(updatedChat.id, finalMessages);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (chatId: string) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, isFavorite: !chat.isFavorite } : chat
    ));
    await chatAPI.toggleFavorite(chatId);
  };

  const updatePromptSettings = (settings: PromptSettings) => {
    setPromptSettings(settings);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        promptSettings,
        createNewChat,
        selectChat,
        sendMessage,
        toggleFavorite,
        updatePromptSettings,
        loading,
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