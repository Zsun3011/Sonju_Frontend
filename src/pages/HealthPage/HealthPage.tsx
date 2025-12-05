// src/pages/HealthPage/HealthPage.tsx
import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import PageHeader from '../../components/common/PageHeader';
import { healthStyles } from '../../styles/Health';

const STORAGE_KEY = '@health_diary_entries';
const MEDICATION_STORAGE_KEY = '@medication_data';

type StatusType = 'Good' | 'Moderate' | 'Concerning' | null;

export default function HealthPage() {
  const navigation = useNavigation<any>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaryEntries, setDiaryEntries] = useState<{ [key: string]: string }>({});

  // ✅ 복약 알림 카드용 상태
  const [reminderTimeText, setReminderTimeText] = useState<string>('—');
  const [reminderDescription, setReminderDescription] = useState<string>('오늘 복약 알림이 없습니다.');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useFocusEffect(
    React.useCallback(() => {
      loadDiaryEntries();
      loadMedicationReminder();
    }, [currentYear, currentMonth])
  );

  const loadDiaryEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setDiaryEntries(JSON.parse(stored));
    } catch (error) {
      console.error('일지 데이터 로드 실패:', error);
    }
  };

  // ===== 복약 알림 계산 유틸 =====
  const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const slotTo24h = (slotTime: string): string => {
    const isAM = slotTime.includes('오전');
    const num = parseInt(slotTime.replace(/[^\d]/g, ''), 10);
    let h = num;
    if (!isAM) {
      if (h !== 12) h += 12;
    } else {
      if (h === 12) h = 0;
    }
    return `${String(h).padStart(2, '0')}:00`;
  };

  const WINDOW_SLOTS = [
    { hour: 8,  time: '오전 8시',  label: '아침' },
    { hour: 12, time: '오후 12시', label: '점심' },
    { hour: 18, time: '오후 6시',  label: '저녁' },
    { hour: 22, time: '오후 10시', label: '취침' },
  ] as const;

  const getCurrentWindowIndex = (): number => {
    const now = new Date();
    const h = now.getHours();

    // 현재 시간이 어느 구간에 속하는지 확인
    if (h < 8) return 0;      // 오전 8시 이전 -> 오전 8시 구간
    if (h < 12) return 0;     // 8시~12시 -> 오전 8시 구간
    if (h < 18) return 1;     // 12시~18시 -> 오후 12시 구간
    if (h < 22) return 2;     // 18시~22시 -> 오후 6시 구간
    return 3;                 // 22시 이후 -> 오후 10시 구간
  };

  const loadMedicationReminder = async () => {
    try {
      const stored = await AsyncStorage.getItem(MEDICATION_STORAGE_KEY);
      const medData: { [key: string]: { time: string; label: string; medications: any[] }[] } =
        stored ? JSON.parse(stored) : {};

      const dateKey = formatDateKey(new Date());
      const todaySlots = medData[dateKey] || [];

      if (!todaySlots.length) {
        setReminderTimeText('—');
        setReminderDescription('오늘 복약 알림이 없습니다.');
        return;
      }

      const currentWindowIdx = getCurrentWindowIndex();

      // 현재 시간 구간부터 오늘의 남은 구간 확인
      for (let i = currentWindowIdx; i < WINDOW_SLOTS.length; i++) {
        const window = WINDOW_SLOTS[i];
        const slot = todaySlots.find(s => s.time === window.time);

        if (!slot) continue;

        const unchecked = slot.medications?.filter((m: any) => !m.checked).map((m: any) => m.name) || [];

        if (unchecked.length > 0) {
          const t24 = slotTo24h(window.time);
          setReminderTimeText(t24);

          if (unchecked.length === 1) {
            setReminderDescription(`${unchecked[0]} 을/를 드셔야 해요.`);
          } else {
            setReminderDescription(`${unchecked[0]} 외 ${unchecked.length - 1}개 드셔야 해요.`);
          }
          return;
        }
      }

      // 모든 구간을 확인했지만 미체크 약이 없는 경우
      const currentWindow = WINDOW_SLOTS[currentWindowIdx];
      setReminderTimeText('—');
      setReminderDescription('오늘 드실 약을 모두 드셨어요! 👍');

    } catch (e) {
      console.error('복약 알림 계산 실패:', e);
      setReminderTimeText('—');
      setReminderDescription('복약 알림을 불러오지 못했습니다.');
    }
  };
  // ==============================

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const isFutureDate = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  const hasEntryForDay = (day: number) => {
    const dateKey = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    return !!(diaryEntries[dateKey] && diaryEntries[dateKey].trim().length > 0);
  };

  const getStatusForDay = (day: number): StatusType => {
    if (!hasEntryForDay(day)) return null;
    const dateKey = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    const content = diaryEntries[dateKey];

    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash = hash & hash;
    }
    const randomValue = Math.abs(hash) % 100;
    if (randomValue < 60) return 'Good';
    if (randomValue < 85) return 'Moderate';
    return 'Concerning';
  };

  const renderCalendar = () => {
    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <View key={`empty-${i}`} style={[healthStyles.calendarDay, { backgroundColor: 'transparent' }]}>
          <ScaledText fontSize={18} style={healthStyles.calendarDayText}></ScaledText>
        </View>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getStatusForDay(day);
      const future = isFutureDate(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            healthStyles.calendarDay,
            status && (healthStyles as any)[`status${status}`],
            isToday(day) && healthStyles.todayBorder,
            future && healthStyles.disabledDay,
          ]}
          onPress={() => {
            if (!future) {
              navigation.navigate('HealthDiaryEntry', {
                date: day,
                month: currentMonth + 1,
                year: currentYear,
              });
            }
          }}
          disabled={future}
        >
          <ScaledText
            fontSize={18}
            style={[
              healthStyles.calendarDayText,
              status && { color: '#333' },
              future && { color: '#CCC' },
            ]}
          >
            {day}
          </ScaledText>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <View style={healthStyles.container}>
      <Image
        source={require('../../../assets/images/배경.png')}
        style={healthStyles.backgroundImage}
        resizeMode="cover"
      />
      <Image
        source={require('../../../assets/images/배경2.png')}
        style={healthStyles.backgroundImage2}
        resizeMode="cover"
      />
      <Image
        source={require('../../../assets/images/병원.png')}
        style={healthStyles.hospitalImage}
        resizeMode="contain"
      />

      <PageHeader
        title="건강"
        onBack={handleBackPress}
      />

      <ScrollView contentContainerStyle={healthStyles.scrollContent}>
        <View style={healthStyles.heroSection}>
          <TouchableOpacity
            style={healthStyles.medicationButtonContainer}
            onPress={() => navigation.navigate('MedicationSettings')}
          >
            <Image
              source={require('../../../assets/images/복약체크.png')}
              style={healthStyles.medicationButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Image
            source={require('../../../assets/images/sonjusmile.png')}
            style={healthStyles.characterImage}
            resizeMode="contain"
          />
        </View>

        {/* ✅ 동적 복약 알림 카드 */}
        <TouchableOpacity
          style={healthStyles.reminderCard}
          onPress={() => navigation.navigate('MedicationSettings')}
        >
          <View style={healthStyles.reminderContent}>
            <View style={healthStyles.reminderTextContainer}>
              <ScaledText fontSize={24} style={healthStyles.reminderTime}>
                {reminderTimeText}
              </ScaledText>
              <ScaledText fontSize={18} style={healthStyles.reminderDescription}>
                {reminderDescription}
              </ScaledText>
            </View>
          </View>
        </TouchableOpacity>

        <View style={healthStyles.calendarCard}>
          <View style={healthStyles.calendarHeader}>
            <View style={healthStyles.calendarMonthSelector}>
              <TouchableOpacity onPress={handlePrevMonth} style={healthStyles.monthArrowButton}>
                <Image
                  source={require('../../../assets/images/왼쪽화살표꼬리X.png')}
                  style={healthStyles.arrowIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <ScaledText fontSize={20} style={healthStyles.calendarTitle}>
                {currentMonth + 1}월 건강 요약 달력
              </ScaledText>

              <TouchableOpacity onPress={handleNextMonth} style={healthStyles.monthArrowButton}>
                <Image
                  source={require('../../../assets/images/오른쪽화살표꼬리X.png')}
                  style={healthStyles.arrowIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={healthStyles.calendarActions}>
              <TouchableOpacity
                style={healthStyles.iconButton}
                onPress={() => navigation.navigate('HealthDiaryEntry')}
              >
                <Image
                  source={require('../../../assets/images/플러스아이콘.png')}
                  style={healthStyles.actionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={healthStyles.iconButton}
                onPress={() => navigation.navigate('HealthDiaryList')}
              >
                <Image
                  source={require('../../../assets/images/목록아이콘.png')}
                  style={healthStyles.actionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={healthStyles.weekdayHeader}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <View key={index} style={healthStyles.weekdayCell}>
                <ScaledText
                  fontSize={20}
                  style={[
                    healthStyles.weekdayText,
                    index === 0 && { color: '#FF6B6B' },
                    index === 6 && { color: '#4A90E2' },
                  ]}
                >
                  {day}
                </ScaledText>
              </View>
            ))}
          </View>

          <View style={healthStyles.calendarGrid}>
            {renderCalendar()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}