// src/types/mission.ts

export interface Mission {
  id: string;
  title: string;
  tag: string;
  description: string;
  question: string;
  points: number;
  completed: boolean;
}

export interface MissionState {
  missions: Mission[];
  lastResetDate: string;
  totalPoints: number;
}