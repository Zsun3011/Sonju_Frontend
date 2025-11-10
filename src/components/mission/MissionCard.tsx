import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Mission } from '../../types/mission';
import { MissionStyles } from '../../styles/MissionStyles';

interface MissionCardProps {
  mission: Mission;
  onStart: (mission: Mission) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onStart }) => {
  return (
    <View style={MissionStyles.missionCard}>
      <View style={MissionStyles.cardHeader}>
        <View style={MissionStyles.titleContainer}>
          <Text style={MissionStyles.cardTitle}>{mission.title}</Text>
          <View style={MissionStyles.tagContainer}>
            <Text style={MissionStyles.tag}>{mission.tag}</Text>
          </View>
        </View>
        <View style={MissionStyles.pointsContainer}>
          <Text style={MissionStyles.points}>{mission.points}</Text>
          <Text style={MissionStyles.pointsLabel}>포인트</Text>
          <Text style={MissionStyles.coinIcon}>💰</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          MissionStyles.missionButton,
          mission.completed && MissionStyles.missionButtonCompleted,
        ]}
        onPress={() => onStart(mission)}
        disabled={mission.completed}
        activeOpacity={0.7}
      >
        <Text
          style={[
            MissionStyles.missionButtonText,
            mission.completed && MissionStyles.missionButtonTextCompleted,
          ]}
        >
          {mission.completed ? '미션 완료' : '미션 시작'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MissionCard;