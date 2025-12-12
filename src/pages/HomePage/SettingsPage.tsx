import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFontSize } from '../../contexts/FontSizeContext';
import ScaledText from '../../components/ScaledText';
import {
  getMyProfile,
  updateMyName,
  updateMyPremium,
  deleteMyAccount,
  getMyAIProfile,
  updateAINickname
} from '../../api/profileApi';
import { apiClient } from '../../api/config';
import { styles } from '../../styles/Setting';

export default function SettingsPage() {
  const navigation = useNavigation<any>();
  const { fontScale, updateFontScale } = useFontSize();

  // State
  const [userName, setUserName] = useState('김춘자');
  const [sonjuName, setSonjuName] = useState('돌쇠');
  const [isPremium, setIsPremium] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showSonjuNameModal, setShowSonjuNameModal] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // 로컬 스토리지에서 빠르게 로드
      const localName = await AsyncStorage.getItem('userName');
      const localSonju = await AsyncStorage.getItem('sonjuName');

      if (localName) setUserName(localName);
      if (localSonju) setSonjuName(localSonju);

      // API에서 최신 프로필 정보 가져오기
      try {
        const profile = await getMyProfile();
        if (profile?.name) {
          setUserName(profile.name);
          await AsyncStorage.setItem('userName', profile.name);
        }
        if (profile?.is_premium !== undefined) {
          setIsPremium(profile.is_premium);
        }
      } catch (apiError) {
        console.log('API 프로필 로드 실패 (로컬 데이터 사용):', apiError);
      }

      // AI 프로필 정보 가져오기
      try {
        const aiProfile = await getMyAIProfile();
        if (aiProfile?.nickname) {
          setSonjuName(aiProfile.nickname);
          await AsyncStorage.setItem('sonjuName', aiProfile.nickname);
        }
      } catch (aiError) {
        console.log('AI 프로필 로드 실패 (로컬 데이터 사용):', aiError);
      }
    } catch (error) {
      console.error('프로필 데이터 로드 실패:', error);
    }
  };

  const handleUpdateName = async () => {
    if (!tempName.trim()) {
      Alert.alert('오류', '이름을 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);

      const response = await updateMyName(tempName.trim());

      console.log('이름 변경 API 응답:', response);

      await AsyncStorage.setItem('userName', tempName.trim());
      setUserName(tempName.trim());

      setShowNameModal(false);
      setTempName('');

      const message = typeof response === 'string'
        ? response
        : response?.message || '이름이 변경되었습니다';

      Alert.alert('성공', message);

    } catch (error: any) {
      console.error('이름 변경 실패:', error);

      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || error.message
        || '이름 변경에 실패했습니다';

      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSonjuName = async () => {
    if (!tempName.trim()) {
      Alert.alert('오류', '손주 이름을 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);

      const response = await updateAINickname(tempName.trim());

      console.log('손주 이름 변경 API 응답:', response);

      await AsyncStorage.setItem('sonjuName', tempName.trim());
      setSonjuName(tempName.trim());

      setShowSonjuNameModal(false);
      setTempName('');

      const message = typeof response === 'string'
        ? response
        : response?.message || '손주 이름이 변경되었습니다';

      Alert.alert('성공', message);

    } catch (error: any) {
      console.error('손주 이름 변경 실패:', error);

      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || error.message
        || '손주 이름 변경에 실패했습니다';

      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeFontSize = async (scale: number) => {
    await updateFontScale(scale);
    setShowFontSizeMenu(false);
  };

  const handleTogglePremium = async () => {
    try {
      setIsLoading(true);

      const newPremiumStatus = !isPremium;
      const response = await updateMyPremium(newPremiumStatus);

      console.log('프리미엄 상태 변경 API 응답:', response);

      setIsPremium(newPremiumStatus);

      const message = typeof response === 'string'
        ? response
        : response?.message || (newPremiumStatus ? '프리미엄이 활성화되었습니다' : '프리미엄이 비활성화되었습니다');

      Alert.alert('성공', message);
    } catch (error: any) {
      console.error('프리미엄 상태 변경 실패:', error);

      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || error.message
        || '프리미엄 상태 변경에 실패했습니다';

      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoading(true);

            console.log('🔄 로그아웃 시작');

            await AsyncStorage.multiRemove([
              'userToken',
              'idToken',
              'accessToken',
              'refreshToken',
              'hasCompletedOnboarding',
              'aiProfile',
              'userName',
              'userPhone',
              'sonjuName',
            ]);

            console.log('✅ AsyncStorage 정리 완료');

            delete apiClient.defaults.headers.common.Authorization;

            console.log('✅ API 헤더 정리 완료');

            // RootNavigator가 감지할 때까지 짧은 대기
            await new Promise(resolve => setTimeout(resolve, 100));

            console.log('✅ 로그아웃 완료 - RootNavigator가 자동으로 화면 전환');

          } catch (error) {
            console.error('❌ 로그아웃 처리 중 오류:', error);

            try {
              await AsyncStorage.clear();
              delete apiClient.defaults.headers.common.Authorization;
            } catch (clearError) {
              console.error('❌ 강제 정리 실패:', clearError);
            }

            Alert.alert('알림', '로그아웃되었습니다');

          } finally {
            setIsLoading(false);
          }
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
          onPress: async () => {
            try {
              setIsLoading(true);

              await deleteMyAccount();
              await AsyncStorage.clear();
              delete apiClient.defaults.headers.common.Authorization;

              Alert.alert('완료', '계정이 삭제되었습니다');

              // RootNavigator가 자동으로 화면 전환

            } catch (error: any) {
              console.error('계정 삭제 실패:', error);

              const errorMessage = error.response?.data?.detail
                || error.response?.data?.message
                || error.message
                || '계정 삭제에 실패했습니다';

              Alert.alert('오류', errorMessage);
            } finally {
              setIsLoading(false);
            }
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
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#02BFDC" />
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={styles.headerTitle}>
          설정
        </ScaledText>
        <TouchableOpacity onPress={handleLogout} disabled={isLoading}>
          <ScaledText fontSize={18} style={styles.logoutButton}>
            로그아웃
          </ScaledText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={require('../../../assets/images/춘자.png')}
              style={styles.profileImage}
            />
          </View>
          <ScaledText fontSize={20} style={styles.profileName}>
            {userName}
          </ScaledText>
        </View>

        {/* 프로필 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            프로필
          </ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setTempName(userName);
              setShowNameModal(true);
            }}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              이름 수정
            </ScaledText>
            <ScaledText fontSize={18} style={styles.menuValue}>
              {userName}
            </ScaledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setTempName(sonjuName);
              setShowSonjuNameModal(true);
            }}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              손주 이름 수정
            </ScaledText>
            <ScaledText fontSize={18} style={styles.menuValue}>
              {sonjuName}
            </ScaledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('알림', '프로필 사진 변경 기능은 준비 중입니다')}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              프로필 사진 변경
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>
                준비 중
              </ScaledText>
              <Icon name="chevron-forward" size={20} color="#02BFDC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 프리미엄 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            프리미엄
          </ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleTogglePremium}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              프리미엄 상태
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={[styles.menuValue, isPremium && { color: '#02BFDC', fontWeight: '600' }]}>
                {isPremium ? '활성화됨' : '비활성화됨'}
              </ScaledText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('알림', '프리미엄 혜택 안내 기능은 준비 중입니다')}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              프리미엄 혜택
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>
                보기
              </ScaledText>
              <Icon name="chevron-forward" size={20} color="#02BFDC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 개인정보 보호 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            개인정보 보호
          </ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('알림', '개인정보 동의서 기능은 준비 중입니다')}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              개인 정보 동의서 보기
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>
                보기
              </ScaledText>
            </View>
          </TouchableOpacity>
        </View>

        {/* 손쉬운 사용 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            손쉬운 사용
          </ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowFontSizeMenu(!showFontSizeMenu)}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              글자 크기 조정
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuValue}>
                {getFontSizeLabel()}
              </ScaledText>
              <Icon name="chevron-down" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {showFontSizeMenu && (
            <View style={styles.fontSizeMenu}>
              <TouchableOpacity
                style={styles.fontSizeOption}
                onPress={() => handleChangeFontSize(0.9)}
              >
                <ScaledText fontSize={18} style={styles.fontSizeLabel}>
                  작게
                </ScaledText>
                {fontScale === 0.9 && <Icon name="checkmark" size={20} color="#02BFDC" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fontSizeOption}
                onPress={() => handleChangeFontSize(1.0)}
              >
                <ScaledText fontSize={16} style={styles.fontSizeLabel}>
                  보통
                </ScaledText>
                {fontScale === 1.0 && <Icon name="checkmark" size={20} color="#02BFDC" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fontSizeOption}
                onPress={() => handleChangeFontSize(1.1)}
              >
                <ScaledText fontSize={16} style={styles.fontSizeLabel}>
                  크게
                </ScaledText>
                {fontScale === 1.1 && <Icon name="checkmark" size={20} color="#02BFDC" />}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 계정 섹션 */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            계정
          </ScaledText>

          <View style={styles.menuItem}>
            <ScaledText fontSize={18} style={styles.menuLabel}>
              버전
            </ScaledText>
            <ScaledText fontSize={18} style={styles.menuValue}>
              1.0.0
            </ScaledText>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDeleteAccount}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              계정 삭제
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>
                삭제하기
              </ScaledText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('알림', '고객센터 기능은 준비 중입니다')}
            disabled={isLoading}
          >
            <ScaledText fontSize={18} style={styles.menuLabel}>
              문의
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={18} style={styles.menuLink}>
                고객센터로 이동
              </ScaledText>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 이름 수정 모달 */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScaledText fontSize={18} style={styles.modalTitle}>
              이름 수정
            </ScaledText>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="새 이름을 입력하세요"
              autoFocus
              editable={!isLoading}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowNameModal(false);
                  setTempName('');
                }}
                disabled={isLoading}
              >
                <ScaledText fontSize={18} style={styles.modalButtonTextCancel}>
                  취소
                </ScaledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateName}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ScaledText fontSize={18} style={styles.modalButtonTextConfirm}>
                    확인
                  </ScaledText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 손주 이름 수정 모달 */}
      <Modal visible={showSonjuNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScaledText fontSize={18} style={styles.modalTitle}>
              손주 이름 수정
            </ScaledText>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="새 손주 이름을 입력하세요"
              autoFocus
              editable={!isLoading}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowSonjuNameModal(false);
                  setTempName('');
                }}
                disabled={isLoading}
              >
                <ScaledText fontSize={18} style={styles.modalButtonTextCancel}>
                  취소
                </ScaledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateSonjuName}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ScaledText fontSize={18} style={styles.modalButtonTextConfirm}>
                    확인
                  </ScaledText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


