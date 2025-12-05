// src/pages/DailyQuestPage.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ScaledText from '../../components/ScaledText';
import PageHeader from '../../components/common/PageHeader';
import { useMission } from '../../contexts/MissionContext';
import { MissionStyles } from '../../styles/MissionStyles';
import { colors } from '../../styles/colors';
import missionService from '../../services/missionService';

type DailyQuestNavigationProp = NativeStackNavigationProp<any>;

const DailyQuestPage = () => {
  const navigation = useNavigation<DailyQuestNavigationProp>();
  const { 
    challenges, 
    loading, 
    error,
    loadChallenges 
  } = useMission();
  
  const [refreshing, setRefreshing] = React.useState(false);

  /**
   * Pull-to-refresh 핸들러
   */
  const handlePullRefresh = async () => {
    setRefreshing(true);
    try {
      await loadChallenges();
    } catch (err) {
      console.error('Pull refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * 로딩 상태
   */
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={MissionStyles.container}>
        <View style={[MissionStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ScaledText fontSize={16} style={MissionStyles.loadingText}>
            오늘의 챌린지를 불러오는 중...
          </ScaledText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * 에러 상태 (챌린지가 없을 때만)
   */
  if (error && !refreshing && (!Array.isArray(challenges) || challenges.length === 0)) {
    return (
      <SafeAreaView style={MissionStyles.container}>
        <View style={[MissionStyles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <Icon name="alert-circle-outline" size={64} color={colors.error} />
          <ScaledText fontSize={16} style={MissionStyles.errorText}>{error}</ScaledText>
          <TouchableOpacity
            style={MissionStyles.retryButton}
            onPress={handlePullRefresh}
          >
            <Icon name="refresh-outline" size={20} color="#FFF" />
            <ScaledText fontSize={16} style={MissionStyles.retryButtonText}>다시 시도</ScaledText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={MissionStyles.container}>
      <View style={MissionStyles.container}>
        {/* Header */}
        <PageHeader
          title="오늘의 챌린지"
          onBack={() => navigation.goBack()}
          safeArea={true}
        />

        {/* Content */}
        <ScrollView
          style={MissionStyles.content}
          contentContainerStyle={MissionStyles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handlePullRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <ScaledText fontSize={14} style={MissionStyles.infoText}>
            매일 밤 12시에 챌린지가 초기화돼요
          </ScaledText>

          {/* 챌린지 통계 */}
          <View style={MissionStyles.statsContainer}>
            <View style={MissionStyles.statItem}>
              <ScaledText fontSize={12} style={MissionStyles.statLabel}>오늘의 챌린지</ScaledText>
              <ScaledText fontSize={20} style={MissionStyles.statValue}>
                {Array.isArray(challenges) ? challenges.length : 0}개
              </ScaledText>
            </View>
            <View style={MissionStyles.statDivider} />
            <View style={MissionStyles.statItem}>
              <ScaledText fontSize={12} style={MissionStyles.statLabel}>총 포인트</ScaledText>
              <ScaledText fontSize={20} style={MissionStyles.statValue}>
                {Array.isArray(challenges) ? challenges.reduce((sum, c) => sum + c.give_point, 0) : 0}P
              </ScaledText>
            </View>
          </View>

          {/* 챌린지 목록 */}
          {!Array.isArray(challenges) || challenges.length === 0 ? (
            <View style={MissionStyles.emptyContainer}>
              <Icon name="calendar-outline" size={64} color={colors.border} />
              <ScaledText fontSize={16} style={MissionStyles.emptyText}>
                등록된 챌린지가 없습니다
              </ScaledText>
              <ScaledText fontSize={14} style={MissionStyles.emptySubtext}>
                내일 새로운 챌린지를 확인해보세요!
              </ScaledText>
            </View>
          ) : (
            <View style={MissionStyles.missionList}>
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

/**
 * 챌린지 카드 컴포넌트 (미션 완료 버튼 추가)
 */
const ChallengeCard = ({ challenge }: { challenge: any }) => {
  const [loading, setLoading] = React.useState(false);
  const { loadChallenges } = useMission(); // 완료 후 목록 새로고침 위해 필요

  /** 🔥 미션 완료 처리 */
  const handleComplete = async () => {
    try {
      setLoading(true);
      await missionService.earnPoint(challenge.give_point); // 포인트 지급
      await loadChallenges(); // UI는 그대로 유지하면서 목록 갱신(완료 제거 효과)
    } catch (err) {
      console.error("미션 완료 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="flag-outline" size={24} color={colors.primary} />
        <View style={styles.cardHeaderText}>
          <ScaledText fontSize={16} style={styles.cardTitle}>
            {challenge.title}
          </ScaledText>
          <ScaledText fontSize={14} style={styles.cardSubtitle}>
            {challenge.subtitle}
          </ScaledText>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.pointBadge}>
          <Icon name="star" size={16} color="#FFD700" />
          <ScaledText fontSize={14} style={styles.pointText}>
            {challenge.give_point}P
          </ScaledText>
        </View>

        {/* 🔥 미션 완료 버튼 (UI 디자인 유지, 요소만 추가) */}
        <TouchableOpacity 
          style={styles.completeBtn}
          onPress={handleComplete}
          disabled={loading}
        >
          <ScaledText fontSize={14} style={styles.completeTxt}>
            {loading ? "처리중..." : "완료하기"}
          </ScaledText>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pointBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  pointText: {
    color: '#D4AF37',
    fontWeight: '600',
  },
  completeBtn: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 8
  },
  completeTxt: {
    color: "#FFF",
    fontWeight: "600"
  },
});

export default DailyQuestPage;