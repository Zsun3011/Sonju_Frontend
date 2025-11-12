// src/services/challenge.ts
import { apiClient } from './config';

/**
 * 챌린지 타입 (백엔드 ChallengeDTO와 일치)
 */
export interface Challenge {
  id: number;
  title: string;
  subtitle: string;
  give_point: number;
}

export const challengeAPI = {
  /**
   * 오늘의 데일리 챌린지 4개 조회
   * GET /challenges/daily
   *
   * 백엔드 응답: List[ChallengeDTO] - 배열을 직접 반환
   */
  getDailyChallenges: async (): Promise<Challenge[]> => {
    try {
      const response = await apiClient.get<Challenge[]>('/challenges/daily');

      // 백엔드는 List[ChallengeDTO]를 직접 반환
      const challenges = response.data;

      if (!Array.isArray(challenges)) {
        console.error('❌ 예상치 못한 응답 형식:', response.data);
        throw new Error('잘못된 응답 형식입니다');
      }

      if (__DEV__) {
        console.log(`✅ 챌린지 ${challenges.length}개 로드 성공`);
      }

      return challenges;
    } catch (error: any) {
      // 네트워크 에러
      if (!error.response) {
        throw new Error('네트워크 연결을 확인해주세요');
      }

      const status = error.response?.status;

      // 401 인증 에러
      if (status === 401) {
        throw new Error('로그인이 필요합니다');
      }

      // 404 챌린지 없음
      if (status === 404) {
        throw new Error('등록된 챌린지가 없습니다');
      }

      // 기타 에러
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || '챌린지를 불러오는데 실패했습니다';
      throw new Error(errorMessage);
    }
  },
};