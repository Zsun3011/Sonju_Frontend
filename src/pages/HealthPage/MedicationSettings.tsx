// src/pages/HealthPage/MedicationSettings.tsx
import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { healthStyles } from '../../styles/Health';

const MEDICATION_STORAGE_KEY = '@medication_data';

interface MedicationItem {
  id: string;
  name: string;
  checked: boolean;
  frequency?: string;
  days?: string;
  startDate?: string;
}

interface TimeSlot {
  time: string;
  label: string;
  medications: MedicationItem[];
}

export default function MedicationSettings() {
  const navigation = useNavigation<any>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [medicationData, setMedicationData] = useState<{ [key: string]: TimeSlot[] }>({});
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [editingMed, setEditingMed] = useState<{
    dateKey: string;
    slotIndex: number;
    medIndex: number;
    medication: MedicationItem;
  } | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedFrequency, setEditedFrequency] = useState('');
  const [editedDays, setEditedDays] = useState('');
  const [editedStartDate, setEditedStartDate] = useState('');

  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDaysPicker, setShowDaysPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const frequencyOptions = ['1', '2', '3', '4'];
  const daysOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date): string => {
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateForDisplay = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const getDateLabel = (date: Date): string => {
    return isToday(date) ? '오늘' : formatDisplayDate(date);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMedicationData();
    }, [])
  );

  const loadMedicationData = async () => {
    try {
      const stored = await AsyncStorage.getItem(MEDICATION_STORAGE_KEY);
      if (stored) {
        setMedicationData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('복약 데이터 로드 실패:', error);
    }
  };

  const saveMedicationData = async (data: { [key: string]: TimeSlot[] }) => {
    try {
      await AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('복약 데이터 저장 실패:', error);
    }
  };

  const getCurrentDayData = (): TimeSlot[] => {
    const dateKey = formatDate(currentDate);
    return medicationData[dateKey] || [];
  };

  const currentTimeSlots = getCurrentDayData();

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const toggleMedication = (slotIndex: number, medId: string) => {
    const dateKey = formatDate(currentDate);
    const currentSlots = getCurrentDayData();

    const updatedSlots = currentSlots.map((slot, idx) => {
      if (idx === slotIndex) {
        return {
          ...slot,
          medications: slot.medications.map(med =>
            med.id === medId ? { ...med, checked: !med.checked } : med
          ),
        };
      }
      return slot;
    });

    const newData = {
      ...medicationData,
      [dateKey]: updatedSlots,
    };

    setMedicationData(newData);
    saveMedicationData(newData);
  };

  const handleMedicationPress = (slotIndex: number, medIndex: number) => {
    const dateKey = formatDate(currentDate);
    const currentSlots = getCurrentDayData();
    const medication = currentSlots[slotIndex].medications[medIndex];

    setEditingMed({
      dateKey,
      slotIndex,
      medIndex,
      medication,
    });
    setEditedName(medication.name);
    setEditedFrequency(medication.frequency || '3');
    setEditedDays(medication.days || '7');
    setEditedStartDate(medication.startDate || formatDateForDisplay(currentDate));
  };

  const closeEditModal = () => {
    setEditingMed(null);
    setEditedName('');
    setEditedFrequency('');
    setEditedDays('');
    setEditedStartDate('');
  };

  const getTimeSlots = (frequency: string): { time: string; label: string }[] => {
    const freq = parseInt(frequency);
    if (freq === 1) return [{ time: '오전 8시', label: '아침' }];
    if (freq === 2) return [
      { time: '오전 8시', label: '아침' },
      { time: '오후 6시', label: '저녁' }
    ];
    if (freq === 3) return [
      { time: '오전 8시', label: '아침' },
      { time: '오후 12시', label: '점심' },
      { time: '오후 6시', label: '저녁' }
    ];
    return [
      { time: '오전 8시', label: '아침' },
      { time: '오후 12시', label: '점심' },
      { time: '오후 6시', label: '저녁' },
      { time: '오후 10시', label: '취침' }
    ];
  };

  const handleSaveEdit = async () => {
    if (!editingMed || !editedName.trim()) {
      alert('약 이름을 입력해주세요.');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(MEDICATION_STORAGE_KEY);
      const existingData = stored ? JSON.parse(stored) : {};

      const oldMedication = editingMed.medication;

      if (oldMedication.startDate && oldMedication.days && oldMedication.frequency) {
        const oldStart = parseDate(oldMedication.startDate);
        const oldDaysCount = parseInt(oldMedication.days);

        for (let i = 0; i < oldDaysCount; i++) {
          const currentDate = new Date(oldStart);
          currentDate.setDate(currentDate.getDate() + i);
          const dateKey = formatDate(currentDate);

          if (existingData[dateKey]) {
            existingData[dateKey].forEach((slot: TimeSlot) => {
              slot.medications = slot.medications.filter(m =>
                !(m.name === oldMedication.name &&
                  m.startDate === oldMedication.startDate &&
                  m.frequency === oldMedication.frequency &&
                  m.days === oldMedication.days)
              );
            });

            existingData[dateKey] = existingData[dateKey].filter((slot: TimeSlot) => slot.medications.length > 0);

            if (existingData[dateKey].length === 0) {
              delete existingData[dateKey];
            }
          }
        }
      }

      const start = parseDate(editedStartDate);
      const daysCount = parseInt(editedDays);
      const timeSlots = getTimeSlots(editedFrequency);

      for (let i = 0; i < daysCount; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(currentDate.getDate() + i);
        const dateKey = formatDate(currentDate);

        if (!existingData[dateKey]) {
          existingData[dateKey] = [];
        }

        timeSlots.forEach(newSlot => {
          let targetSlot = existingData[dateKey].find((slot: TimeSlot) => slot.time === newSlot.time);

          if (!targetSlot) {
            targetSlot = {
              time: newSlot.time,
              label: newSlot.label,
              medications: []
            };
            existingData[dateKey].push(targetSlot);
          }

          const medId = `${dateKey}-${newSlot.time}-${editedName}-${Date.now()}-${Math.random()}`;
          const exists = targetSlot.medications.some((m: MedicationItem) =>
            m.name === editedName &&
            m.startDate === editedStartDate &&
            m.frequency === editedFrequency &&
            m.days === editedDays
          );

          if (!exists) {
            targetSlot.medications.push({
              id: medId,
              name: editedName,
              checked: false,
              frequency: editedFrequency,
              days: editedDays,
              startDate: editedStartDate,
            });
          }
        });

        existingData[dateKey].sort((a: TimeSlot, b: TimeSlot) => {
          const timeOrder = ['오전 8시', '오후 12시', '오후 6시', '오후 10시'];
          return timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time);
        });
      }

      await AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(existingData));
      setMedicationData(existingData);
      closeEditModal();
    } catch (error) {
      console.error('복약 데이터 수정 실패:', error);
    }
  };

  const handleDeleteMedication = async () => {
    if (!editingMed) return;

    try {
      const stored = await AsyncStorage.getItem(MEDICATION_STORAGE_KEY);
      const existingData = stored ? JSON.parse(stored) : {};

      const medication = editingMed.medication;

      if (medication.startDate && medication.days) {
        const start = parseDate(medication.startDate);
        const daysCount = parseInt(medication.days);

        for (let i = 0; i < daysCount; i++) {
          const currentDate = new Date(start);
          currentDate.setDate(currentDate.getDate() + i);
          const dateKey = formatDate(currentDate);

          if (existingData[dateKey]) {
            existingData[dateKey].forEach((slot: TimeSlot) => {
              slot.medications = slot.medications.filter(m =>
                !(m.name === medication.name &&
                  m.startDate === medication.startDate &&
                  m.frequency === medication.frequency &&
                  m.days === medication.days)
              );
            });

            existingData[dateKey] = existingData[dateKey].filter((slot: TimeSlot) => slot.medications.length > 0);

            if (existingData[dateKey].length === 0) {
              delete existingData[dateKey];
            }
          }
        }
      } else {
        const dateKey = editingMed.dateKey;
        const updatedSlots = [...existingData[dateKey]];
        updatedSlots[editingMed.slotIndex].medications.splice(editingMed.medIndex, 1);

        const filteredSlots = updatedSlots.filter(slot => slot.medications.length > 0);

        if (filteredSlots.length === 0) {
          delete existingData[dateKey];
        } else {
          existingData[dateKey] = filteredSlots;
        }
      }

      await AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(existingData));
      setMedicationData(existingData);
      closeEditModal();
    } catch (error) {
      console.error('복약 데이터 삭제 실패:', error);
    }
  };

  const handleFrequencySelect = (freq: string) => {
    setEditedFrequency(freq);
    setShowFrequencyPicker(false);
  };

  const handleDaysSelect = (days: string) => {
    setEditedDays(days);
    setShowDaysPicker(false);
  };

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDate = parseDate(editedStartDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setEditedStartDate(formatDateForDisplay(currentDate));
  };

  return (
    <View style={healthStyles.container}>
      <View style={healthStyles.header}>
        <TouchableOpacity style={healthStyles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/images/왼쪽화살표.png')} style={healthStyles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={healthStyles.headerTitle}>복약 알림 설정</ScaledText>
      </View>

      <ScrollView contentContainerStyle={healthStyles.scrollContent}>
        <View style={healthStyles.medicationContainer}>
          <View style={healthStyles.dateCard}>
            <View style={healthStyles.dateSelector}>
              <TouchableOpacity style={healthStyles.dateArrow} onPress={handlePrevDay}>
                <Image source={require('../../../assets/images/왼쪽화살표꼬리X.png')} style={healthStyles.arrowIcon} resizeMode="contain" />
              </TouchableOpacity>
              <ScaledText fontSize={24} style={healthStyles.dateText}>{getDateLabel(currentDate)}</ScaledText>
              <TouchableOpacity style={healthStyles.dateArrow} onPress={handleNextDay}>
                <Image source={require('../../../assets/images/오른쪽화살표꼬리X.png')} style={healthStyles.arrowIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>

          {currentTimeSlots.length === 0 ? (
            <View style={healthStyles.emptyStateContainer}>
              <ScaledText fontSize={18} style={healthStyles.emptyStateText}>등록된 복약 알림이 없습니다.</ScaledText>
            </View>
          ) : (
            currentTimeSlots.map((slot, slotIndex) => (
              <View key={`${formatDate(currentDate)}-${slot.time}`} style={healthStyles.timeSlotCard}>
                <View style={healthStyles.timeSlotHeader}>
                  <ScaledText fontSize={24} style={healthStyles.timeSlotTime}>{slot.time}</ScaledText>
                </View>
                <View style={healthStyles.medicationList}>
                  {slot.medications.map((med, medIndex) => (
                    <View key={med.id} style={healthStyles.medicationItem}>
                      <TouchableOpacity style={healthStyles.medicationNameContainer} onPress={() => handleMedicationPress(slotIndex, medIndex)}>
                        <ScaledText fontSize={18} style={healthStyles.medicationName}>{med.name}</ScaledText>
                      </TouchableOpacity>
                      <TouchableOpacity style={healthStyles.checkboxContainer} onPress={() => toggleMedication(slotIndex, med.id)}>
                        <Image source={med.checked ? require('../../../assets/images/체크후아이콘.png') : require('../../../assets/images/체크아이콘.png')} style={healthStyles.checkIcon} resizeMode="contain" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* 약 수정 모달 - 수정됨 */}
      <Modal
        visible={editingMed !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={closeEditModal}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.editMedicationModal}>
              <ScaledText fontSize={24} style={healthStyles.modalTitle}>약 정보 수정</ScaledText>

              <View style={healthStyles.editModalField}>
                <ScaledText fontSize={20} style={healthStyles.editModalLabel}>약 이름</ScaledText>
                <TextInput style={healthStyles.editModalInput} value={editedName} onChangeText={setEditedName} placeholder="약 이름" placeholderTextColor="#999" />
              </View>

              <TouchableOpacity style={healthStyles.editModalField} onPress={() => setShowFrequencyPicker(true)}>
                <ScaledText fontSize={20} style={healthStyles.editModalLabel}>투약 횟수 (1일)</ScaledText>
                <View style={healthStyles.editModalInput}>
                  <ScaledText fontSize={18} style={healthStyles.inputText}>{editedFrequency}회</ScaledText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={healthStyles.editModalField} onPress={() => setShowDaysPicker(true)}>
                <ScaledText fontSize={20} style={healthStyles.editModalLabel}>투약 일수</ScaledText>
                <View style={healthStyles.editModalInput}>
                  <ScaledText fontSize={18} style={healthStyles.inputText}>{editedDays}일</ScaledText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={healthStyles.editModalField} onPress={() => setShowDatePicker(true)}>
                <ScaledText fontSize={20} style={healthStyles.editModalLabel}>투약 시작일</ScaledText>
                <View style={healthStyles.editModalInput}>
                  <ScaledText fontSize={18} style={healthStyles.inputText}>{editedStartDate}</ScaledText>
                </View>
              </TouchableOpacity>

              <View style={healthStyles.editModalButtons}>
                <TouchableOpacity style={healthStyles.deleteButton} onPress={handleDeleteMedication}>
                  <ScaledText fontSize={20} style={healthStyles.deleteButtonText}>삭제</ScaledText>
                </TouchableOpacity>
                <View style={healthStyles.editModalRightButtons}>
                  <TouchableOpacity style={healthStyles.editModalCancelButton} onPress={closeEditModal}>
                    <ScaledText fontSize={20} style={healthStyles.editModalCancelText}>취소</ScaledText>
                  </TouchableOpacity>
                  <TouchableOpacity style={healthStyles.editModalSaveButton} onPress={handleSaveEdit}>
                    <ScaledText fontSize={20} style={healthStyles.editModalSaveText}>저장</ScaledText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 투약 횟수 선택 모달 - 수정됨 */}
      <Modal visible={showFrequencyPicker} transparent={true} animationType="fade" onRequestClose={() => setShowFrequencyPicker(false)}>
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFrequencyPicker(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.pickerModalContent}>
              <ScaledText fontSize={20} style={healthStyles.modalTitle}>투약 횟수 선택</ScaledText>
              <ScrollView style={healthStyles.pickerList}>
                {frequencyOptions.map(freq => (
                  <TouchableOpacity key={freq} style={healthStyles.pickerItem} onPress={() => handleFrequencySelect(freq)}>
                    <ScaledText fontSize={18} style={healthStyles.pickerItemText}>{freq}회</ScaledText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={healthStyles.pickerCancelButton} onPress={() => setShowFrequencyPicker(false)}>
                <ScaledText fontSize={16} style={healthStyles.pickerCancelText}>취소</ScaledText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 투약 일수 선택 모달 - 수정됨 */}
      <Modal visible={showDaysPicker} transparent={true} animationType="fade" onRequestClose={() => setShowDaysPicker(false)}>
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDaysPicker(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.pickerModalContent}>
              <ScaledText fontSize={20} style={healthStyles.modalTitle}>투약 일수 선택</ScaledText>
              <ScrollView style={healthStyles.pickerList}>
                {daysOptions.map(days => (
                  <TouchableOpacity key={days} style={healthStyles.pickerItem} onPress={() => handleDaysSelect(days)}>
                    <ScaledText fontSize={18} style={healthStyles.pickerItemText}>{days}일</ScaledText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={healthStyles.pickerCancelButton} onPress={() => setShowDaysPicker(false)}>
                <ScaledText fontSize={16} style={healthStyles.pickerCancelText}>취소</ScaledText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 날짜 선택 모달 - 수정됨 */}
      <Modal visible={showDatePicker} transparent={true} animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.datePickerModalContent}>
              <ScaledText fontSize={20} style={healthStyles.modalTitle}>투약 시작일 선택</ScaledText>
              <View style={healthStyles.datePickerContainer}>
                <TouchableOpacity style={healthStyles.dateArrowButton} onPress={() => handleDateChange('prev')}>
                  <Image source={require('../../../assets/images/왼쪽화살표꼬리X.png')} style={healthStyles.datePickerArrow} resizeMode="contain" />
                </TouchableOpacity>
                <ScaledText fontSize={22} style={healthStyles.datePickerText}>{editedStartDate}</ScaledText>
                <TouchableOpacity style={healthStyles.dateArrowButton} onPress={() => handleDateChange('next')}>
                  <Image source={require('../../../assets/images/오른쪽화살표꼬리X.png')} style={healthStyles.datePickerArrow} resizeMode="contain" />
                </TouchableOpacity>
              </View>
              <View style={healthStyles.modalButtons}>
                <TouchableOpacity style={healthStyles.modalCancelButton} onPress={() => setShowDatePicker(false)}>
                  <ScaledText fontSize={16} style={healthStyles.modalCancelText}>취소</ScaledText>
                </TouchableOpacity>
                <TouchableOpacity style={healthStyles.modalConfirmButton} onPress={() => setShowDatePicker(false)}>
                  <ScaledText fontSize={16} style={healthStyles.modalConfirmText}>확인</ScaledText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {showAddMenu && (
        <>
          <TouchableOpacity style={healthStyles.menuOverlay} activeOpacity={1} onPress={() => setShowAddMenu(false)} />
          <View style={healthStyles.floatingMenu}>
            <TouchableOpacity style={healthStyles.menuButton} onPress={() => { setShowAddMenu(false); navigation.navigate('PrescriptionOCR'); }}>
              <ScaledText fontSize={24} style={healthStyles.menuButtonText}>처방전 {'\n'} 이미지 인식</ScaledText>
            </TouchableOpacity>
            <TouchableOpacity style={healthStyles.menuButton} onPress={() => { setShowAddMenu(false); navigation.navigate('ManualMedicationEntry'); }}>
              <ScaledText fontSize={24} style={healthStyles.menuButtonText}>직접 입력</ScaledText>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity style={healthStyles.addButton} onPress={() => setShowAddMenu(!showAddMenu)}>
        <Image source={require('../../../assets/images/플러스아이콘.png')} style={healthStyles.addIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}