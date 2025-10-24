// src/contexts/FontSizeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FontSizeContextType {
  fontScale: number;
  updateFontScale: (scale: number) => Promise<void>;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
  const [fontScale, setFontScale] = useState<number>(1.0); // 기본값 1.0 (보통)

  // 앱 시작 시 저장된 글자 크기 불러오기
  useEffect(() => {
    loadFontScale();
  }, []);

  const loadFontScale = async () => {
    try {
      const savedScale = await AsyncStorage.getItem('fontScale');
      if (savedScale !== null) {
        setFontScale(parseFloat(savedScale));
      }
    } catch (error) {
      console.error('글자 크기 불러오기 실패:', error);
    }
  };

  const updateFontScale = async (scale: number): Promise<void> => {
    try {
      setFontScale(scale);
      await AsyncStorage.setItem('fontScale', scale.toString());
    } catch (error) {
      console.error('글자 크기 저장 실패:', error);
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontScale, updateFontScale }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = (): FontSizeContextType => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize는 FontSizeProvider 내에서 사용되어야 합니다');
  }
  return context;
};