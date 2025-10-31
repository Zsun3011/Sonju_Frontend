import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 로그아웃 및 온보딩으로 이동
export const logout = async (navigation: any) => {
  try {
    // 토큰 삭제
    await AsyncStorage.multiRemove(['token', 'userId', 'userName']);
    
    // 네비게이션 리셋 (뒤로가기 불가능하게)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      })
    );
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};

// 로그인 성공 후 메인으로 이동
export const navigateToMain = (navigation: any) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    })
  );
};

// 특정 탭으로 이동
export const navigateToTab = (navigation: any, tabName: string) => {
  navigation.navigate('Main', {
    screen: tabName,
  });
};

// 채팅방으로 이동
export const navigateToChat = (navigation: any, chatId?: string) => {
  navigation.navigate('Main', {
    screen: 'ChatTab',
    params: {
      screen: 'AIChat',
      params: { chatId },
    },
  });
};