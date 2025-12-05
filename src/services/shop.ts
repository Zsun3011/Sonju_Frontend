// src/services/shop.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../api/config';

/**
 * 상점 API 응답 타입
 */
export interface PurchaseResponse {
  item_number: number;
  message: string;
}

export interface EquipResponse {
  item_number: number;
  message: string;
}

export interface UnequipResponse {
  message: string;
}

/**
 * 상점 API 엔드포인트 설정
 * 
 * ✅ 실제 백엔드 API 엔드포인트
 */
const ENDPOINTS = {
  purchase: '/item/buy',      // POST - 아이템 구매
  equip: '/item/equip',       // POST - 아이템 장착
  unequip: '/item/unequip',   // DELETE - 아이템 해제
};

/**
 * 상점 API 서비스
 */
export const shopAPI = {
  /**
   * AccessToken 가져오기
   */
  getAccessToken: async (): Promise<string> => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    return token;
  },

  /**
   * 상점에서 아이템 구매
   * POST /shop/buy (또는 올바른 엔드포인트)
   * 
   * @param itemNumber - 구매할 아이템 번호
   * @returns { item_number, message: "아이템 구매 정보가 등록되었습니다." }
   */
  purchaseItem: async (itemNumber: number): Promise<PurchaseResponse> => {
    try {
      const token = await shopAPI.getAccessToken();
      
      console.log(`🛒 구매 API 호출: ${ENDPOINTS.purchase}`);
      console.log(`   아이템 번호: ${itemNumber}`);
      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.purchase}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ item_number: itemNumber }),
      });

      console.log(`   응답 상태: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `엔드포인트를 찾을 수 없습니다. ` +
            `백엔드 API 문서를 확인하고 ENDPOINTS.purchase를 수정하세요. ` +
            `현재: ${ENDPOINTS.purchase}`
          );
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `구매 실패 (${response.status})`
        );
      }

      const data = await response.json();
      console.log(`   ✅ 구매 성공:`, data);
      return data;
    } catch (error) {
      console.error('❌ purchaseItem 에러:', error);
      throw error;
    }
  },

  /**
   * 아이템 장착
   * POST /shop/equip (또는 올바른 엔드포인트)
   * 
   * @param itemNumber - 장착할 아이템 번호
   * @returns { item_number, message: "리본 아이템이 장착되었습니다." }
   */
  equipItem: async (itemNumber: number): Promise<EquipResponse> => {
    try {
      const token = await shopAPI.getAccessToken();
      
      console.log(`👔 장착 API 호출: ${ENDPOINTS.equip}`);
      console.log(`   아이템 번호: ${itemNumber}`);
      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.equip}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ item_number: itemNumber }),
      });

      console.log(`   응답 상태: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `엔드포인트를 찾을 수 없습니다. ` +
            `백엔드 API 문서를 확인하고 ENDPOINTS.equip을 수정하세요. ` +
            `현재: ${ENDPOINTS.equip}`
          );
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `장착 실패 (${response.status})`
        );
      }

      const data = await response.json();
      console.log(`   ✅ 장착 성공:`, data);
      return data;
    } catch (error) {
      console.error('❌ equipItem 에러:', error);
      throw error;
    }
  },

  /**
   * 아이템 장착 해제
   * DELETE /shop/equip (또는 올바른 엔드포인트)
   * 
   * @returns { message: "아이템이 장착 해제되었습니다." }
   */
  unequipItem: async (): Promise<UnequipResponse> => {
    try {
      const token = await shopAPI.getAccessToken();
      
      console.log(`🔓 해제 API 호출: DELETE ${ENDPOINTS.unequip}`);
      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.unequip}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`   응답 상태: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `엔드포인트를 찾을 수 없습니다. ` +
            `백엔드 API 문서를 확인하고 ENDPOINTS.unequip을 수정하세요. ` +
            `현재: ${ENDPOINTS.unequip}`
          );
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `해제 실패 (${response.status})`
        );
      }

      const data = await response.json();
      console.log(`   ✅ 해제 성공:`, data);
      return data;
    } catch (error) {
      console.error('❌ unequipItem 에러:', error);
      throw error;
    }
  },
};