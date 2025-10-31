import { apiClient } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// OpenAI API 키 설정 (환경변수로 관리 권장)
const OPENAI_API_KEY = 'your-openai-api-key';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export const chatAPI = {
  // ChatGPT API 호출
  sendMessage: async (messages: ChatMessage[], promptSettings?: any): Promise<ChatResponse> => {
    try {
      // 프롬프트 설정 적용
      const systemMessage = promptSettings 
        ? createSystemPrompt(promptSettings)
        : '당신은 할머니, 할아버지를 돕는 친절한 AI 손주입니다.';

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemMessage },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // 채팅 기록 저장
  saveChatHistory: async (chatId: string, messages: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('채팅 저장 실패:', error);
    }
  },

  // 채팅 기록 불러오기
  loadChatHistory: async (chatId: string): Promise<ChatMessage[]> => {
    try {
      const data = await AsyncStorage.getItem(`chat_${chatId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('채팅 불러오기 실패:', error);
      return [];
    }
  },

  // 채팅 목록 가져오기
  getChatList: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const chatKeys = keys.filter(key => key.startsWith('chat_'));
      const chats = await AsyncStorage.multiGet(chatKeys);
      
      return chats.map(([key, value]) => ({
        id: key.replace('chat_', ''),
        messages: JSON.parse(value || '[]'),
      }));
    } catch (error) {
      console.error('채팅 목록 불러오기 실패:', error);
      return [];
    }
  },

  // 즐겨찾기 토글
  toggleFavorite: async (chatId: string) => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoriteList = favorites ? JSON.parse(favorites) : [];
      
      const index = favoriteList.indexOf(chatId);
      if (index > -1) {
        favoriteList.splice(index, 1);
      } else {
        favoriteList.push(chatId);
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favoriteList));
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  },
};

// 프롬프트 설정을 시스템 메시지로 변환
function createSystemPrompt(settings: any): string {
  let prompt = '당신은 할머니, 할아버지를 돕는 친절한 AI 손주입니다. ';
  
  if (settings.personality) {
    const personalityMap = {
      '다정한': '매우 다정하고 따뜻한 말투로',
      '활발한': '밝고 활기찬 말투로',
      '경청하는': '공감하며 경청하는 태도로',
      '유머러스한': '유머를 섞어가며',
    };
    prompt += personalityMap[settings.personality] || '';
  }
  
  if (settings.tone) {
    const toneMap = {
      '존댓말': '존댓말을 사용하여',
      '귀여운': '귀여운 말투로',
      '부드러운': '부드러운 말투로',
    };
    prompt += ' ' + (toneMap[settings.tone] || '');
  }
  
  if (settings.emotionalExpression) {
    const emotionMap = {
      '적당히': '적절한 수준의 감정 표현으로',
      '평범한': '평범한 감정 표현으로',
      '농담조금': '가끔 농담을 섞어가며',
      '풍부하게': '풍부한 감정 표현으로',
    };
    prompt += ' ' + (emotionMap[settings.emotionalExpression] || '');
  }
  
  if (settings.interests) {
    const interestMap = {
      '뉴스': '최신 뉴스와 시사에 대해',
      '요리': '요리와 음식에 대해',
      '운동': '건강과 운동에 대해',
      '취미추천': '취미와 여가 활동에 대해',
    };
    const interests = settings.interests.map((i: string) => interestMap[i]).filter(Boolean);
    if (interests.length > 0) {
      prompt += ` 특히 ${interests.join(', ')}에 관심을 가지고`;
    }
  }
  
  prompt += ' 대화해주세요.';
  
  return prompt;
}