import { apiClient } from './config';

export interface SignUpWithCognitoRequest {
  name: string;
  gender: 'male' | 'female';
  birthDate: string; // YYYYMMDD
  phone: string;
  password: string;
}

export interface ConfirmSignUpRequest {
  phone: string;
  verificationCode: string;
}

export const authAPI = {
  // Cognito 회원가입 (인증번호 발송까지)
  signUpWithCognito: async (data: SignUpWithCognitoRequest) => {
    try {
      const response = await apiClient.post('/auth/cognito/signup', {
        name: data.name,
        gender: data.gender,
        birthDate: data.birthDate,
        phoneNumber: data.phone, // Cognito는 +82 형식 필요할 수 있음
        password: data.password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: '회원가입에 실패했습니다' };
    }
  },

  // Cognito 인증번호 확인
  confirmSignUp: async (data: ConfirmSignUpRequest) => {
    try {
      const response = await apiClient.post('/auth/cognito/confirm', {
        phoneNumber: data.phone,
        confirmationCode: data.verificationCode,
      });
      return response.data;
    } catch (error: any) {

      throw error.response?.data || { success: false, message: '인증에 실패했습니다' };
    }
  },

  // 인증번호 재발송
  resendVerificationCode: async (data: { phone: string }) => {
    try {
      const response = await apiClient.post('/auth/cognito/resend', {
        phoneNumber: data.phone,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: '재발송에 실패했습니다' };
    }
  },

  // 로그인 (Cognito)
  login: async (data: { phone: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/cognito/login', {
        phoneNumber: data.phone,
        password: data.password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: '로그인에 실패했습니다' };
    }
  },
};