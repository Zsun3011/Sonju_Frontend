// src/services/chatService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../api/config';

export interface SendMessageRequest {
  message: string;
  chat_list_num?: number;
  enable_tts?: boolean;
}

export interface MessageItem {
  chat_list_num: number;
  chat_num: number;
  message: string;
  tts_path?: string;
  chat_date: string;
  chat_time: string;
}

export interface TodoMeta {
  has_todo: boolean;
  step: string; // "none" | "suggest" | "ask_confirm" | "ask_date" | "saved" | "cancelled"
  task?: string;
  date?: string;
  time?: string;
}

export interface TurnResponse {
  ai: MessageItem;
  todo: TodoMeta;
}

export interface MessageItemList {
  chat_list_num: number;
  chat_num: number;
  message: string;
}

export interface ChatListItem {
  chat_list_num: number;
  last_date: string;
  last_message?: string;
}

export interface BulkDeleteResponse {
  deleted_count: number;
  deleted_lists: number[];
  not_found: number[];
}

class ChatService {
  private async getAccessToken(): Promise<string> {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Access token not found');
    }
    return token;
  }

  /**
   * 메시지 전송 및 AI 응답 받기
   * POST /chats/messages
   */
  async sendMessage(request: SendMessageRequest): Promise<TurnResponse> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/chats/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: request.message,
          chat_list_num: request.chat_list_num,
          enable_tts: request.enable_tts ?? false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data: TurnResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * 특정 채팅방의 전체 메시지 조회
   * GET /chats/messages/{list_no}
   */
  async getMessages(chatListNum: number): Promise<MessageItemList[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/chats/messages/${chatListNum}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data: MessageItemList[] = await response.json();
      return data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  /**
   * 채팅방 목록 조회 (각 방의 마지막 메시지)
   * GET /chats/lists
   */
  async getChatLists(): Promise<ChatListItem[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/chats/lists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data: ChatListItem[] = await response.json();
      return data;
    } catch (error) {
      console.error('Get chat lists error:', error);
      throw error;
    }
  }

  /**
   * 여러 채팅방 일괄 삭제
   * POST /chats/bulk-delete
   */
  async bulkDeleteChats(chatListNums: number[]): Promise<BulkDeleteResponse> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/chats/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          list_no: chatListNums,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data: BulkDeleteResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Bulk delete chats error:', error);
      throw error;
    }
  }
}

export default new ChatService();