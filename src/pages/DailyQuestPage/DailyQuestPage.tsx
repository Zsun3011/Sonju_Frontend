import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MissionCard from '../../components/mission/MissionCard';
import MissionModal from '../../components/mission/MissionModal';
import { useMission } from '../../contexts/MissionContext';
import { Mission } from '../../types/mission';
import { MissionStyles } from '../../styles/MissionStyles';
import { colors } from '../../styles/colors';

type DailyQuestNavigationProp = NativeStackNavigationProp<any>;

const DailyQuestPage = () => {
  const navigation = useNavigation<DailyQuestNavigationProp>();
  const { missions, loading, error, setCurrentMission, refreshMissions } = useMission();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleMissionStart = (mission: Mission) => {
    if (mission.completed) return;
    setSelectedMission(mission);
    setModalVisible(true);
  };

  const handleStartChat = () => {
    if (selectedMission) {
      setCurrentMission(selectedMission);
      setModalVisible(false);
      navigation.navigate('MissionChat');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshMissions();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={MissionStyles.container}>
      <View style={MissionStyles.container}>
      {/* Header */}
      <View style={MissionStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={MissionStyles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={MissionStyles.headerTitle}>오늘의 미션</Text>
        <View style={MissionStyles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={MissionStyles.content}
        contentContainerStyle={MissionStyles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={MissionStyles.infoText}>매일 밤 12시에 미션이 초기화돼요</Text>

        {/* 로딩 상태 */}
        {loading && !refreshing && (
          <View style={MissionStyles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={MissionStyles.loadingText}>미션을 불러오는 중...</Text>
          </View>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <View style={MissionStyles.centerContainer}>
            <Icon name="alert-circle-outline" size={48} color={colors.error} />
            <Text style={MissionStyles.errorText}>{error}</Text>
            <TouchableOpacity
              style={MissionStyles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={MissionStyles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 미션 목록 */}
        {!loading && !error && (
          <View style={MissionStyles.missionList}>
            {missions.length > 0 ? (
              missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} onStart={handleMissionStart} />
              ))
            ) : (
              <View style={MissionStyles.centerContainer}>
                <Icon name="checkmark-circle-outline" size={48} color={colors.primary} />
                <Text style={MissionStyles.emptyText}>오늘의 미션이 없습니다</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <MissionModal
        mission={selectedMission}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartChat={handleStartChat}
      />
    </View>
    </SafeAreaView>
  );
};

export default DailyQuestPage;