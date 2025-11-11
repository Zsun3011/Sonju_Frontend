import axios from 'axios';

// API 기본 URL
export const API_BASE_URL = 'http://ec2-15-165-129-83.ap-northeast-2.compute.amazonaws.com:8002';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (필요시 토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // 여기에서 토큰을 추가하거나 로그를 출력할 수 있습니다
    console.log('API 요청:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API 에러:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
