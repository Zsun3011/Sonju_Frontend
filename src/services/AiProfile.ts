// src/services/aiProfile.ts
import { apiClient } from './config';
import { 
  AiProfile, 
  CreateAiProfileRequest, 
  UpdateAiProfileRequest 
} from '../types/ai';

/**
 * AI 프로필 관련 API
 */
export const aiProfileAPI = {
  /**
   * AI 프로필 생성 (온보딩)
   * POST /ai-profile
   */
  createAiProfile: async (data: CreateAiProfileRequest) => {
    try {
      const response = await apiClient.post('/ai-profile', {
        nickname: data.nickname,
        personality: data.personality,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: 'AI 프로필 생성에 실패했습니다' 
      };
    }
  },

  /**
   * AI 프로필 조회
   * GET /ai-profile
   */
  getAiProfile: async (): Promise<AiProfile> => {
    try {
      const response = await apiClient.get('/ai-profile');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: 'AI 프로필을 불러오는데 실패했습니다' 
      };
    }
  },

  /**
   * AI 프로필 수정
   * PUT /ai-profile
   */
  updateAiProfile: async (data: UpdateAiProfileRequest) => {
    try {
      const response = await apiClient.put('/ai-profile', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: 'AI 프로필 수정에 실패했습니다' 
      };
    }
  },

  /**
   * AI 프로필 삭제
   * DELETE /ai-profile
   */
  deleteAiProfile: async () => {
    try {
      const response = await apiClient.delete('/ai-profile');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: 'AI 프로필 삭제에 실패했습니다' 
      };
    }
  },
};