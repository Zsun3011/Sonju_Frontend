// src/contexts/MissionContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Mission } from '../types/mission';
import { challengeAPI, Challenge } from '../services/challenge';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MissionContextType {
  missions: Mission[];
  currentMission: Mission | null;
  loading: boolean;
  error: string | null;
  totalPoints: number;
  setCurrentMission: (mission: Mission | null) => void;
  completeMission: (missionId: number) => void;
  refreshMissions: () => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

const COMPLETED_MISSIONS_KEY = 'completedMissions';

export const MissionProvider = ({ children }: { children: ReactNode }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 오늘 완료한 미션 ID 목록 불러오기
   */
  const loadCompletedMissions = async (): Promise<number[]> => {
    try {
      const today = new Date().toDateString();
      const stored = await AsyncStorage.getItem(COMPLETED_MISSIONS_KEY);
      
      if (stored) {
        const data = JSON.parse(stored);
        // 오늘 날짜가 아니면 초기화
        if (data.date !== today) {
          await AsyncStorage.removeItem(COMPLETED_MISSIONS_KEY);
          return [];
        }
        return data.ids || [];
      }
      return [];
    } catch (error) {
      console.error('완료 미션 로드 실패:', error);
      return [];
    }
  };

  /**
   * 완료한 미션 ID 저장
   */
  const saveCompletedMissions = async (ids: number[]) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(
        COMPLETED_MISSIONS_KEY,
        JSON.stringify({ date: today, ids })
      );
    } catch (error) {
      console.error('완료 미션 저장 실패:', error);
    }
  };

  /**
   * Challenge를 Mission으로 변환
   */
  const convertChallengeToMission = (
    challenge: Challenge,
    completedIds: number[]
  ): Mission => {
    return {
      id: challenge.id,
      title: challenge.title,
      subtitle: challenge.subtitle,
      points: challenge.give_point,
      completed: completedIds.includes(challenge.id),
    };
  };

  /**
   * 미션(챌린지) 목록 불러오기
   */
  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // 백엔드에서 오늘의 챌린지 가져오기
      const challenges = await challengeAPI.getDailyChallenges();

      // 완료한 미션 목록 가져오기
      const completedIds = await loadCompletedMissions();

      // Challenge를 Mission으로 변환
      const missionsData = challenges.map((challenge) =>
        convertChallengeToMission(challenge, completedIds)
      );

      setMissions(missionsData);
      console.log('✅ 미션 로드 성공:', missionsData);
    } catch (err: any) {
      const errorMessage = err.message || '미션을 불러올 수 없습니다.';
      setError(errorMessage);
      console.error('❌ 미션 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 미션 완료 처리
   */
  const completeMission = async (missionId: number) => {
    try {
      // 로컬 상태 업데이트
      setMissions((prev) =>
        prev.map((mission) =>
          mission.id === missionId ? { ...mission, completed: true } : mission
        )
      );

      // AsyncStorage에 완료 상태 저장
      const completedIds = await loadCompletedMissions();
      if (!completedIds.includes(missionId)) {
        completedIds.push(missionId);
        await saveCompletedMissions(completedIds);
      }

      // TODO: 백엔드에 완료 API 호출 (백엔드에 API 추가 시 구현)
      // await challengeAPI.completeChallenge(missionId, userId);

      console.log('✅ 미션 완료:', missionId);
    } catch (error) {
      console.error('❌ 미션 완료 처리 실패:', error);
    }
  };

  /**
   * 미션 새로고침
   */
  const refreshMissions = async () => {
    await fetchMissions();
  };

  /**
   * 완료한 미션의 총 포인트 계산
   */
  const totalPoints = useMemo(() => {
    return missions
      .filter((mission) => mission.completed)
      .reduce((sum, mission) => sum + mission.points, 0);
  }, [missions]);

  /**
   * 초기 로드
   */
  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <MissionContext.Provider
      value={{
        missions,
        currentMission,
        loading,
        error,
        totalPoints,
        setCurrentMission,
        completeMission,
        refreshMissions,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within MissionProvider');
  }
  return context;
};