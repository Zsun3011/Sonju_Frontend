// src/contexts/PointContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { challengeAPI } from '../services/challenge';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PointContextType {
  points: number;
  loading: boolean;
  error: string | null;
  refreshPoints: () => Promise<void>;
  addPoints: (amount: number) => void;
  setPoints: (amount: number) => void;
}

const PointContext = createContext<PointContextType | undefined>(undefined);

const POINTS_CACHE_KEY = 'userPoints';

export const PointProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬 캐시에서 포인트 불러오기
   */
  const loadCachedPoints = async (): Promise<number> => {
    try {
      const cached = await AsyncStorage.getItem(POINTS_CACHE_KEY);
      if (cached) {
        const cachedPoints = parseInt(cached, 10);
        setPoints(cachedPoints);
        return cachedPoints;
      }
      return 0;
    } catch (error) {
      console.error('캐시된 포인트 로드 실패:', error);
      return 0;
    }
  };

  /**
   * 포인트를 로컬 캐시에 저장
   */
  const saveCachedPoints = async (amount: number) => {
    try {
      await AsyncStorage.setItem(POINTS_CACHE_KEY, amount.toString());
    } catch (error) {
      console.error('포인트 캐시 저장 실패:', error);
    }
  };

  /**
   * 서버에서 포인트 조회
   */
  const fetchPoints = async () => {
    try {
      setLoading(true);
      setError(null);

      const serverPoints = await challengeAPI.getMyPoints();
      setPoints(serverPoints);
      await saveCachedPoints(serverPoints);

      console.log('✅ 포인트 조회 성공:', serverPoints);
    } catch (err: any) {
      const errorMessage = err.message || '포인트를 불러올 수 없습니다.';
      setError(errorMessage);
      console.error('❌ 포인트 조회 실패:', err);

      // 실패 시 캐시된 포인트 사용
      await loadCachedPoints();
    } finally {
      setLoading(false);
    }
  };

  /**
   * 포인트 새로고침
   */
  const refreshPoints = async () => {
    await fetchPoints();
  };

  /**
   * 포인트 추가 (로컬 상태)
   */
  const addPoints = (amount: number) => {
    setPoints((prev) => {
      const newPoints = prev + amount;
      saveCachedPoints(newPoints);
      return newPoints;
    });
  };

  /**
   * 포인트 설정 (서버 응답 반영)
   */
  const setPointsValue = (amount: number) => {
    setPoints(amount);
    saveCachedPoints(amount);
  };

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadCachedPoints().then(() => {
      fetchPoints();
    });
  }, []);

  return (
    <PointContext.Provider
      value={{
        points,
        loading,
        error,
        refreshPoints,
        addPoints,
        setPoints: setPointsValue,
      }}
    >
      {children}
    </PointContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointContext);
  if (!context) {
    throw new Error('usePoints must be used within PointProvider');
  }
  return context;
};