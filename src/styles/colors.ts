// src/styles/colors.ts

export const colors = {
  // Primary Colors (하늘색 계열 - 이미지 기준)
  primary: '#02BFDC',        // 메인 하늘색 (버튼, 강조)
  primaryLight: '#33CCE5',   // 밝은 하늘색
  primaryDark: '#019DB8',    // 어두운 하늘색

  // Background Colors (연한 하늘색 배경 - 이미지 기준)
  background: '#D9F2F5',     // 메인 배경색
  backgroundLight: '#E8F7FA', // 더 밝은 배경
  
  // Surface Colors
  white: '#FFFFFF',
  card: '#FFFFFF',
  surface: '#FFFFFF',

  // Secondary Colors
  secondary: '#E8F7FA',      // 보조 색상 (추천 질문 버튼 등)
  
  // Border Colors
  border: '#B8E6EA',         // 테두리 색상
  borderLight: '#D0EEF2',    // 밝은 테두리

  // Text Colors
  text: '#2D4550',           // 주요 텍스트 (진한 청록색)
  textSecondary: '#7A9CA5',  // 보조 텍스트 (회색빛 청록색)
  textMuted: '#A5BCC3',      // 흐린 텍스트

  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Accent Colors
  accent: '#02BFDC',         // primary와 동일
  accentLight: '#33CCE5',

  // Shadow
  shadow: '#000000',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Glow effect (캐릭터 주변 효과)
  glowPrimary: 'rgba(2, 191, 220, 0.2)',
  glowPrimaryLight: 'rgba(2, 191, 220, 0.3)',
} as const;

// 다크 모드를 위한 색상 (필요시 사용)
export const darkColors = {
  primary: '#02BFDC',
  background: '#1A2F35',
  backgroundLight: '#243B42',
  white: '#FFFFFF',
  card: '#2D4550',
  surface: '#243B42',
  secondary: '#2D4550',
  border: '#3D5A63',
  borderLight: '#4A6870',
  text: '#E8F7FA',
  textSecondary: '#B8E6EA',
  textMuted: '#7A9CA5',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  accent: '#02BFDC',
  accentLight: '#33CCE5',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  glowPrimary: 'rgba(2, 191, 220, 0.3)',
  glowPrimaryLight: 'rgba(2, 191, 220, 0.4)',
} as const;

// 타입 정의
export type ColorScheme = typeof colors;
export type ColorKey = keyof ColorScheme;