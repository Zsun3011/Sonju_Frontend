import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MissionCard from '../../components/mission/MissionCard';
import MissionModal from '../../components/mission/MissionModal';
import { useMission } from '../../contexts/MissionContext';
import { Mission } from '../../types/mission';
import { MissionStyles } from '../../styles/MissionStyles';
import { colors } from '../../styles/colors';
import ScaledText from '../../components/ScaledText';

type DailyQuestNavigationProp = NativeStackNavigationProp<any>;

const DailyQuestPage = () => {
  const navigation = useNavigation<DailyQuestNavigationProp>();
  const { missions, setCurrentMission } = useMission();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  return (
    <SafeAreaView style={MissionStyles.container}>
      <View style={MissionStyles.container}>
        {/* Header */}
        <View style={MissionStyles.header}>
          {/* 큰 글씨 24 */}
          <ScaledText style={MissionStyles.headerTitle} fontSize={24}>
            오늘의 미션
          </ScaledText>

          <View style={MissionStyles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView
          style={MissionStyles.content}
          contentContainerStyle={MissionStyles.contentContainer}
        >
          {/* 작은 글씨 18 */}
          <ScaledText style={MissionStyles.infoText} fontSize={20}>
            매일 밤 12시에 미션이 초기화돼요
          </ScaledText>

          <View style={MissionStyles.missionList}>
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onStart={handleMissionStart} />
            ))}
          </View>
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
