import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission, MissionState } from '../types/mission';

interface MissionContextType {
  missions: Mission[];
  totalPoints: number;
  completeMission: (missionId: string) => void;
  currentMission: Mission | null;
  setCurrentMission: (mission: Mission | null) => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

// 전체 미션 풀
const MISSION_POOL: Omit<Mission, 'id' | 'completed'>[] = [
  {
    title: '오늘의 뉴스 3줄 요약',
    tag: '#질문 따라하기',
    description: '버튼을 눌러 돌쇠에게 "오늘의 뉴스 3줄 요약해줘"라고 질문해보세요!',
    question: '오늘의 뉴스 3줄 요약해줘',
    points: 3,
  },
  {
    title: '내일 날씨 알아보기',
    tag: '#정보 조사하기',
    description: '버튼을 눌러 돌쇠에게 "내일 날씨 알려줘"라고 질문해보세요!',
    question: '내일 날씨 알려줘',
    points: 3,
  },
  {
    title: '김치찜 조리법 물어보기',
    tag: '#조건 조사하기',
    description: '버튼을 눌러 돌쇠에게 "김치찜 조리법 알려줘"라고 질문해보세요!',
    question: '김치찜 조리법 알려줘',
    points: 3,
  },
  {
    title: '가볼 만한 곳 추천받기',
    tag: '#질문 따라하기',
    description: '버튼을 눌러 돌쇠에게 "서울에서 가볼 만한 곳 추천해줘"라고 질문해보세요!',
    question: '서울에서 가볼 만한 곳 추천해줘',
    points: 3,
  },
  {
    title: '건강 정보 알아보기',
    tag: '#정보 조사하기',
    description: '버튼을 눌러 돌쇠에게 "혈압 관리 방법 알려줘"라고 질문해보세요!',
    question: '혈압 관리 방법 알려줘',
    points: 3,
  },
  {
    title: '운동법 물어보기',
    tag: '#조건 조사하기',
    description: '버튼을 눌러 돌쇠에게 "집에서 할 수 있는 간단한 운동법 알려줘"라고 질문해보세요!',
    question: '집에서 할 수 있는 간단한 운동법 알려줘',
    points: 3,
  },
];

// 랜덤으로 4개 미션 선택
const getRandomMissions = (): Mission[] => {
  const shuffled = [...MISSION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).map((mission, index) => ({
    ...mission,
    id: `mission-${index}`,
    completed: false,
  }));
};

// 오늘 날짜 체크
const isToday = (dateStr: string): boolean => {
  const today = new Date().toDateString();
  return new Date(dateStr).toDateString() === today;
};

export const MissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastResetDate, setLastResetDate] = useState('');
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);

  // AsyncStorage에서 상태 로드
  useEffect(() => {
    loadMissionState();
  }, []);

  const loadMissionState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('missionState');
      if (savedState) {
        const state: MissionState = JSON.parse(savedState);

        // 오늘 날짜가 아니면 리셋
        if (!isToday(state.lastResetDate)) {
          const newMissions = getRandomMissions();
          setMissions(newMissions);
          setLastResetDate(new Date().toISOString());
        } else {
          setMissions(state.missions);
          setTotalPoints(state.totalPoints);
          setLastResetDate(state.lastResetDate);
        }
      } else {
        // 첫 실행
        const newMissions = getRandomMissions();
        setMissions(newMissions);
        setLastResetDate(new Date().toISOString());
      }
    } catch (error) {
      console.error('Failed to load mission state:', error);
    }
  };

  // 상태 변경 시 AsyncStorage에 저장
  useEffect(() => {
    if (missions.length > 0) {
      saveMissionState();
    }
  }, [missions, lastResetDate, totalPoints]);

  const saveMissionState = async () => {
    try {
      const state: MissionState = {
        missions,
        lastResetDate,
        totalPoints,
      };
      await AsyncStorage.setItem('missionState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save mission state:', error);
    }
  };

  const completeMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((mission) => {
        if (mission.id === missionId && !mission.completed) {
          setTotalPoints((points) => points + mission.points);
          return { ...mission, completed: true };
        }
        return mission;
      })
    );
  };

  return (
    <MissionContext.Provider
      value={{
        missions,
        totalPoints,
        completeMission,
        currentMission,
        setCurrentMission,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};