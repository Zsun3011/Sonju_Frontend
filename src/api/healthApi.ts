import { apiClient } from './config';

export interface HealthMemoRequest {
  memo_date: string; // YYYY-MM-DD 형식
  memo_text: string;
}

export interface HealthMemoResponse {
  response_message: string;
  memo_text: string;
  memo_date: string;
  status: string;
}

/**
 * 건강 일지 저장/수정
 */
export const saveHealthMemo = async (
  memo_date: string,
  memo_text: string
): Promise<HealthMemoResponse> => {
  try {
    const response = await apiClient.post<HealthMemoResponse>('/health/memos', {
      memo_date,
      memo_text,
    });

    console.log('✅ 건강 일지 저장 성공:', response.data.response_message);
    return response.data;
  } catch (error: any) {
    console.error('❌ 건강 일지 저장 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 특정 날짜의 건강 일지 조회
 */
export const getHealthMemo = async (requested_date: string): Promise<string> => {
  try {
    const response = await apiClient.get('/health/memos', {
      params: { requested_date },
    });

    // API 응답이 문자열이 아닐 수 있으므로 명시적으로 처리
    const memoText = typeof response.data === 'string'
      ? response.data
      : response.data?.memo_text || '';

    console.log(`✅ 건강 일지 조회 성공 (${requested_date}):`, memoText ? '있음' : '없음');
    return memoText;
  } catch (error: any) {
    console.error('❌ 건강 일지 조회 실패:', error.response?.data || error.message);
    return '';
  }
};

/**
 * 특정 월의 모든 일지 조회
 */
export const getHealthMemosForMonth = async (
  year: number,
  month: number
): Promise<{ [key: string]: string }> => {
  try {
    // requested_month 파라미터 사용
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const response = await apiClient.get('/health/memos', {
      params: { requested_month: monthStr },
    });

    const memos: { [key: string]: string } = {};

    // API 응답 처리
    if (response.data) {
      // 응답이 배열인 경우
      if (Array.isArray(response.data)) {
        response.data.forEach((item: any) => {
          if (item.memo_date && item.memo_text) {
            // YYYY-MM-DD를 YYYY/MM/DD로 변환
            const displayDateKey = item.memo_date.replace(/-/g, '/');
            memos[displayDateKey] = item.memo_text;
          }
        });
      }
      // 응답이 객체인 경우 (날짜를 키로 하는 객체)
      else if (typeof response.data === 'object') {
        Object.entries(response.data).forEach(([date, content]) => {
          // YYYY-MM-DD를 YYYY/MM/DD로 변환
          const displayDateKey = date.replace(/-/g, '/');
          // content가 문자열이면 그대로, 객체면 memo_text 추출
          const memoText = typeof content === 'string'
            ? content
            : (content as any)?.memo_text || '';

          if (memoText) {
            memos[displayDateKey] = memoText;
          }
        });
      }
    }

    console.log(`✅ ${year}년 ${month}월 일지 조회 완료: ${Object.keys(memos).length}개`);
    return memos;
  } catch (error) {
    console.error('❌ 월별 일지 조회 실패:', error);
    return {};
  }
};