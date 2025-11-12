import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFontSize } from '../../contexts/FontSizeContext';
import { useChat } from '../../contexts/ChatContext';
import ScaledText from '../../components/ScaledText';

export default function SettingsPage() {
  const navigation = useNavigation<any>();
  const { fontScale, updateFontScale } = useFontSize();
  const { deleteAllChats } = useChat();

  // 상태
  const [userName, setUserName] = useState('김춘자');
  const [sonjuName, setSonjuName] = useState('돌쇠');
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);

  // 모달 상태
  const [showNameModal, setShowNameModal] = useState(false);
  const [showSonjuNameModal, setShowSonjuNameModal] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const sonju = await AsyncStorage.getItem('sonjuName');
      if (name) setUserName(name);
      if (sonju) setSonjuName(sonju);
    } catch (error) {
      console.error('사용자 데이터 로드 실패:', error);
    }
  };

  const handleUpdateName = async () => {
    if (!tempName.trim()) {
      Alert.alert('오류', '이름을 입력해주세요');
      return;
    }
    try {
      await AsyncStorage.setItem('userName', tempName.trim());
      setUserName(tempName.trim());
      setShowNameModal(false);
      setTempName('');
      Alert.alert('성공', '이름이 변경되었습니다');
    } catch (error) {
      Alert.alert('오류', '이름 변경에 실패했습니다');
    }
  };

  const handleUpdateSonjuName = async () => {
    if (!tempName.trim()) {
      Alert.alert('오류', '손주 이름을 입력해주세요');
      return;
    }
    try {
      await AsyncStorage.setItem('sonjuName', tempName.trim());
      setSonjuName(tempName.trim());
      setShowSonjuNameModal(false);
      setTempName('');
      Alert.alert('성공', '손주 이름이 변경되었습니다');
    } catch (error) {
      Alert.alert('오류', '손주 이름 변경에 실패했습니다');
    }
  };

  // 글자 크기
  const handleChangeFontSize = async (scale: number) => {
    await updateFontScale(scale);
    setShowFontSizeMenu(false);
  };

  const handleDeleteAllChats = () => {
    Alert.alert(
      '대화 기록 삭제',
      '모든 대화 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            deleteAllChats();
            Alert.alert('완료', '모든 대화 기록이 삭제되었습니다');
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('hasCompletedOnboarding');
          // RootNavigator가 자동으로 로그인 화면으로 이동
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '정말로 계정을 삭제하시겠습니까?\n모든 데이터가 영구적으로 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            // TODO: 백엔드 API 호출하여 계정 삭제
            Alert.alert('알림', '계정 삭제 기능은 준비 중입니다');
          },
        },
      ],
    );
  };

  const getFontSizeLabel = () => {
    if (fontScale === 0.9) return '작게';
    if (fontScale === 1.0) return '보통';
    if (fontScale === 1.1) return '크게';
    return '보통';
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={styles.headerTitle}>설정</ScaledText>
        <TouchableOpacity onPress={handleLogout}>
          <ScaledText fontSize={18} style={styles.logoutButton}>로그아웃</ScaledText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 프로필 이미지 (고정 이미지) */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={require('../../../assets/images/춘자.png')}
              style={styles.profileImage}
            />
          </View>
          <ScaledText fontSize={20} style={styles.profileName}>{userName}</ScaledText>
        </View>

        {/* 프로필 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>프로필</ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setTempName(userName);
              setShowNameModal(true);
            }}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>이름 수정</ScaledText>
            <ScaledText fontSize={18} style={styles.menuValue}>{userName}</ScaledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setTempName(sonjuName);
              setShowSonjuNameModal(true);
            }}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>손주 이름 수정</ScaledText>
            <ScaledText fontSize={18} style={styles.menuValue}>{sonjuName}</ScaledText>
          </TouchableOpacity>

          {/* 사진 변경 비활성화 */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('알림', '프로필 사진 변경 기능은 준비 중입니다')}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>프로필 사진 변경</ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>준비 중</ScaledText>
              <Icon name="chevron-forward" size={20} color="#02BFDC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 개인정보 보호 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>개인정보 보호</ScaledText>

          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAllChats}>
            <ScaledText fontSize={18} style={styles.menuLabel}>대화 기록 삭제</ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>모두 삭제하기</ScaledText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('알림', '개인정보 동의서 기능은 준비 중입니다')}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>개인 정보 동의서 보기</ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>보기</ScaledText>
            </View>
          </TouchableOpacity>
        </View>

        {/* 손쉬운 사용 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>손쉬운 사용</ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowFontSizeMenu(!showFontSizeMenu)}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>글자 크기 조정</ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuValue}>{getFontSizeLabel()}</ScaledText>
              <Icon name="chevron-down" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {showFontSizeMenu && (
            <View style={styles.fontSizeMenu}>
              <TouchableOpacity
                style={styles.fontSizeOption}
                onPress={() => handleChangeFontSize(0.9)}
              >
                <ScaledText fontSize={18} style={styles.fontSizeLabel}>작게</ScaledText>
                {fontScale === 0.9 && <Icon name="checkmark" size={20} color="#02BFDC" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fontSizeOption}
                onPress={() => handleChangeFontSize(1.0)}
              >
                <ScaledText fontSize={16} style={styles.fontSizeLabel}>보통</ScaledText>
                {fontScale === 1.0 && <Icon name="checkmark" size={20} color="#02BFDC" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fontSizeOption}
                onPress={() => handleChangeFontSize(1.1)}
              >
                <ScaledText fontSize={16} style={styles.fontSizeLabel}>크게</ScaledText>
                {fontScale === 1.1 && <Icon name="checkmark" size={20} color="#02BFDC" />}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 계정 섹션 */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>계정</ScaledText>

          <View style={styles.menuItem}>
            <ScaledText fontSize={18} style={styles.menuLabel}>버전</ScaledText>
            <ScaledText fontSize={18} style={styles.menuValue}>x.x.x</ScaledText>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
            <ScaledText fontSize={18} style={styles.menuLabel}>계정 삭제</ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>삭제하기</ScaledText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('알림', '고객센터 기능은 준비 중입니다')}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>문의</ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>고객센터로 이동</ScaledText>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 이름 수정 모달 */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScaledText fontSize={18} style={styles.modalTitle}>이름 수정</ScaledText>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="새 이름을 입력하세요"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowNameModal(false);
                  setTempName('');
                }}
              >
                <ScaledText fontSize={18} style={styles.modalButtonTextCancel}>취소</ScaledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateName}
              >
                <ScaledText fontSize={18} style={styles.modalButtonTextConfirm}>확인</ScaledText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 손주 이름 수정 모달 */}
      <Modal visible={showSonjuNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScaledText fontSize={18} style={styles.modalTitle}>손주 이름 수정</ScaledText>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="새 손주 이름을 입력하세요"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowSonjuNameModal(false);
                  setTempName('');
                }}
              >
                <ScaledText fontSize={18} style={styles.modalButtonTextCancel}>취소</ScaledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateSonjuName}
              >
                <ScaledText fontSize={18} style={styles.modalButtonTextConfirm}>확인</ScaledText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B8E9F5', fontFamily: 'Pretendard-Medium'},
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
  },
  backButton: { padding: 4 },
  headerTitle: { fontWeight: '600', color: '#000', paddingLeft: 140, paddingRight: 90 },
  logoutButton: { color: '#02BFDC' },
  content: { flex: 1, paddingHorizontal: 30 },
  profileImageContainer: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  profileImageWrapper: {
    width: 120, height: 120, borderRadius: 20, backgroundColor: '#FFB8B8',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  profileImage: {  width: '90%',
                    height: '90%',
                    resizeMode: 'contain', marginTop: 13 },
  profileName: { fontWeight: '600', color: '#000' },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16 },
  sectionTitle: { fontWeight: '600', color: '#000', marginBottom: 16 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  menuLabel: { color: '#000' },
  menuValue: { color: '#666' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  menuLink: { color: '#02BFDC' },
  fontSizeMenu: { marginTop: 8, backgroundColor: '#F8F8F8', borderRadius: 12, padding: 8 },
  fontSizeOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 16,
  },
  fontSizeLabel: { color: '#000' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center',
    alignItems: 'center', padding: 20,
  },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 },
  modalTitle: { fontWeight: '600', color: '#000', marginBottom: 20, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#F0F0F0' },
  modalButtonConfirm: { backgroundColor: '#02BFDC' },
  modalButtonTextCancel: { color: '#666', fontWeight: '600' },
  modalButtonTextConfirm: { color: '#fff', fontWeight: '600' },
});
