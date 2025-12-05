// src/contexts/ChatContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../api/config';

// ================================
// 🔥 타입 정의
// ================================
export interface ChatMessage {
  chat_num: number;
  message: string;
  isUser: boolean;
  chat_date: string;
  chat_time: string;
}

export interface ChatListItem {
  chat_list_num: number;
  last_message: string;
  last_date: string;
}

export interface TodoMeta {
  has_todo: boolean;
  step: string;
  task?: string;
  date?: string;
  time?: string;
  todo_num?: number;
}

// ================================
// 🔥 Context 타입
// ================================
interface ChatContextType {
  chatLists: ChatListItem[];
  currentChat: { chat_list_num: number; messages: ChatMessage[] } | null;

  sendMessageToAI(message: string, chat_list_num?: number, tts?: boolean): Promise<void>;
  loadChatLists(): Promise<void>;
  loadChatMessages(chat_list_num: number): Promise<void>;
  deleteChatLists(listIds: number[]): Promise<any>;
  
  clearChat(): void;

  currentTodoMeta: TodoMeta | null;
  setCurrentTodoMeta(v: TodoMeta | null): void;
}

// ================================
// 🔥 Context 생성
// ================================
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatLists, setChatLists] = useState<ChatListItem[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [currentTodoMeta, setCurrentTodoMeta] = useState<TodoMeta | null>(null);

  // ================================
  // 📥 AccessToken 가져오기
  // ================================
  const getToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error("로그인 토큰 없음");
    return token;
  };

  // ================================
  // 🔥 ① 메시지 전송 + AI 응답 생성
  // ================================
  const sendMessageToAI = useCallback(async (message: string, chat_list_num?: number, tts=false) => {
    const token = await getToken();

    const body = {
      message,
      chat_list_num: chat_list_num ?? null
    };

    const res = await fetch(`${API_BASE_URL}/chats/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    // 🔹 currentChat 없으면 생성
    const chatId = data.ai.chat_list_num;
    if (!currentChat || currentChat.chat_list_num !== chatId) {
      setCurrentChat({ chat_list_num: chatId, messages: [] });
    }

    // 🔻 사용자 메시지 추가
    setCurrentChat(prev => ({
      chat_list_num: chatId,
      messages: [
        ...prev?.messages ?? [],
        { chat_num:-1, message, isUser:true, chat_date:'', chat_time:'' }
      ]
    }));

    // 🔻 AI 응답 추가
    setCurrentChat(prev => ({
      chat_list_num: chatId,
      messages: [...prev.messages, {
        chat_num: data.ai.chat_num,
        message: data.ai.message,
        isUser:false,
        chat_date:data.ai.chat_date,
        chat_time:data.ai.chat_time
      }]
    }));

    // ChatContext.tsx (핵심 부분만 줌)
    // ★ 여기서 todo.step 값에 따라 ChatRoom UI에서 대응 가능

    if (data.todo) {
      setCurrentTodoMeta(data.todo);

      switch(data.todo.step) {
          case "suggest":
              console.log("💬 할일 제안받음 → 유저가 Yes/No 또는 그냥 대답하면 흘러감");
              break;

          case "ask_confirm":
              console.log("🤔 AI가 확인 요청중 → '응', '취소', '아니오' 등 자연어 그대로 전송하면 됨");
              break;

          case "ask_date":
              console.log("📅 AI가 날짜/시간 요청중 → 희경이 입력하는 자연어 그대로 sendMessageToAI()");
              break;

          case "saved":
              console.log(`🎉 Todo 생성 완료 (#${data.todo.todo_num})`);
              break;

          case "cancelled":
              console.log("❌ Todo 등록 취소됨 → 다음 대화 계속");
              break;

          case "none":
          default:
              break;
      }
    }


    await loadChatLists(); // 최근 메시지 갱신
  }, [currentChat]);

  // ================================
  // 🔥 ② 채팅방 목록 가져오기
  // ================================
  const loadChatLists = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${API_BASE_URL}/chats/lists`, {
      headers:{ "Authorization": `Bearer ${token}` }
    });
    setChatLists(await res.json());
  }, []);

  // ================================
  // 🔥 ③ 특정 채팅방 메시지 로드
  // ================================
  const loadChatMessages = useCallback( async (listNum:number) => {
    const token = await getToken();
    const res = await fetch(`${API_BASE_URL}/chats/messages/${listNum}`, {
      headers:{ "Authorization": `Bearer ${token}` }
    });

    const messages = await res.json();
    setCurrentChat({ chat_list_num:listNum, messages });
  }, []);

  // ================================
  // 🔥 ④ 채팅방 삭제
  // ================================
  const deleteChatLists = useCallback(async(listIds:number[])=>{
    const token = await getToken();

    const res = await fetch(`${API_BASE_URL}/chats/bulk-delete`, {
      method:"POST",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({ chat_list_nums:listIds })
    });

    await loadChatLists();
    return await res.json();
  },[]);

  // ================================
  // 🔥 ⑤ 전체 채팅 리셋
  // ================================
  const clearChat = () => setCurrentChat(null);

  return (
    <ChatContext.Provider value={{
      chatLists,
      currentChat,
      sendMessageToAI,
      loadChatLists,
      loadChatMessages,
      deleteChatLists,
      clearChat,
      currentTodoMeta,
      setCurrentTodoMeta
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
