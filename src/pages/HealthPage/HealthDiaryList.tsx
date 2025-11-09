// src/pages/HealthPage/HealthDiaryList.tsx
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { healthStyles } from '../../styles/Health';

const STORAGE_KEY = '@health_diary_entries';

interface DiaryEntry {
  date: string;
  preview: string;
}

export default function HealthDiaryList() {
  const navigation = useNavigation<any>();

  // 현재 날짜를 기준으로 초기화
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 실제 오늘 날짜
  const realToday = new Date();
  const realYear = realToday.getFullYear();
  const realMonth = realToday.getMonth() + 1;

  // 앱 시작 날짜 (예: 2025년 1월부터)
  const firstRecordDate = new Date(2025, 0, 1); // 2025년 1월 1일
  const firstRecordYear = firstRecordDate.getFullYear();
  const firstRecordMonth = firstRecordDate.getMonth() + 1;

  // 화살표 활성화 상태
  const canGoLeft = !(currentYear === firstRecordYear && currentMonth === firstRecordMonth);
  const canGoRight = !(currentYear === realYear && currentMonth === realMonth);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [currentYear, currentMonth])
  );

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allEntries = JSON.parse(stored);

        // 현재 월에 해당하는 일지만 필터링 (YYYY/MM 형식)
        const monthKey = `${currentYear}/${String(currentMonth).padStart(2, '0')}`;
        const filtered = Object.entries(allEntries)
          .filter(([date]) => date.startsWith(monthKey))
          .map(([date, content]) => ({
            date,
            preview: typeof content === 'string'
              ? (content.length > 20 ? content.substring(0, 20) + '...' : content)
              : '내용 없음'
          }))
          .sort((a, b) => b.date.localeCompare(a.date)); // 최신순 정렬

        setEntries(filtered);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('일지 목록 불러오기 실패:', error);
      setEntries([]);
    }
  };

  const handlePrevMonth = () => {
    if (!canGoLeft) return;

    const newDate = new Date(currentYear, currentMonth - 2, 1); // -2 because month is 1-indexed
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    if (!canGoRight) return;

    const newDate = new Date(currentYear, currentMonth, 1); // currentMonth because it's 1-indexed
    setCurrentDate(newDate);
  };

  return (
    <View style={healthStyles.container}>
      {/* 헤더 */}
      <View style={healthStyles.header}>
        <TouchableOpacity
          style={healthStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../assets/images/왼쪽화살표.png')}
            style={healthStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={healthStyles.headerTitle}>
          건강 요약 달력
        </ScaledText>
      </View>

      <ScrollView contentContainerStyle={healthStyles.scrollContent}>
        {/* 일지 메인 컨테이너 */}
        <View style={healthStyles.diaryListContainer}>
          {/* 월 선택 카드 */}
          <View style={healthStyles.monthCard}>
            <View style={healthStyles.monthSelector}>
              <TouchableOpacity
                style={healthStyles.monthArrow}
                onPress={handlePrevMonth}
                disabled={!canGoLeft}
              >
                <Image
                  source={require('../../../assets/images/왼쪽화살표꼬리X.png')}
                  style={[
                    healthStyles.arrowIcon,
                    !canGoLeft && { tintColor: '#D0D0D0' }
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <ScaledText fontSize={24} style={healthStyles.monthText}>
                {currentYear}년 {currentMonth}월
              </ScaledText>
              <TouchableOpacity
                style={healthStyles.monthArrow}
                onPress={handleNextMonth}
                disabled={!canGoRight}
              >
                <Image
                  source={require('../../../assets/images/오른쪽화살표꼬리X.png')}
                  style={[
                    healthStyles.arrowIcon,
                    !canGoRight && { tintColor: '#D0D0D0' }
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 일지 목록 */}
          <View style={healthStyles.entriesList}>
            {entries.length > 0 ? (
              entries.map((entry, index) => {
                // 날짜 파싱 (YYYY/MM/DD)
                const dateParts = entry.date.split('/');
                const entryYear = parseInt(dateParts[0]);
                const entryMonth = parseInt(dateParts[1]);
                const entryDay = parseInt(dateParts[2]);

                return (
                  <TouchableOpacity
                    key={index}
                    style={healthStyles.entryListCard}
                    onPress={() => navigation.navigate('HealthDiaryEntry', {
                      date: entryDay,
                      month: entryMonth,
                      year: entryYear
                    })}
                  >
                    <ScaledText fontSize={24} style={healthStyles.entryDate}>
                      {entry.date}
                    </ScaledText>
                    <ScaledText fontSize={24} style={healthStyles.entryPreview}>
                      {entry.preview}
                    </ScaledText>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ScaledText fontSize={18} style={{ color: '#999' }}>
                  {currentYear}년 {currentMonth}월에 작성된 일지가 없습니다
                </ScaledText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 추가 버튼 */}
      <TouchableOpacity
        style={healthStyles.addButton}
        onPress={() => navigation.navigate('HealthDiaryEntry')}
      >
        <Image
          source={require('../../../assets/images/플러스아이콘.png')}
          style={healthStyles.addIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}