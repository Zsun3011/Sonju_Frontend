// src/api/config.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// API 기본 URL
export const API_BASE_URL = 'http://coopteam7-beanstalk-env.eba-xevuqgji.ap-northeast-2.elasticbeanstalk.com';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

// ⭐ 요청 인터셉터 - 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('📤 API 요청:', {
        url: `${config.baseURL}${config.url}`,
        method: config.method?.toUpperCase(),
        token: token ? `있음 (${token.substring(0, 20)}...)` : '없음',
      });
      
      return config;
    } catch (error) {
      console.error('❌ Request Interceptor Error:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API 응답:', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  async (error) => {
    console.error('❌ API 에러:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    // 401 에러 시 토큰 삭제
    if (error.response?.status === 401) {
      console.log('🔒 401 인증 실패 - 토큰 삭제');
      await AsyncStorage.removeItem('userToken');
    }

    return Promise.reject(error);
  }
);