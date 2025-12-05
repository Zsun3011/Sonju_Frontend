// src/components/mission/MissionCard.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScaledText from '../ScaledText';
import { Mission } from '../../types/mission';

interface MissionCardProps {
  mission: Mission;
  onStart: (mission: Mission) => void;
}

const MissionCard = ({ mission, onStart }: MissionCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.card, mission.completed && styles.cardCompleted]}
      onPress={() => onStart(mission)}
      disabled={mission.completed}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon
            name={mission.completed ? 'checkmark-circle' : 'trophy-outline'}
            size={28}
            color={mission.completed ? '#4CAF50' : '#FF6B6B'}
          />
        </View>
        <View style={styles.pointBadge}>
          <Icon name="star" size={14} color="#FFD700" />
          <ScaledText fontSize={13} style={styles.pointText}>+{mission.points}</ScaledText>
        </View>
      </View>

      <ScaledText fontSize={18} style={[styles.title, mission.completed && styles.titleCompleted]}>
        {mission.title}
      </ScaledText>
      <ScaledText fontSize={14} style={[styles.subtitle, mission.completed && styles.subtitleCompleted]}>
        {mission.subtitle}
      </ScaledText>

      {mission.completed ? (
        <View style={styles.completedBadge}>
          <ScaledText fontSize={15} style={styles.completedText}>완료</ScaledText>
        </View>
      ) : (
        <View style={styles.startButton}>
          <ScaledText fontSize={15} style={styles.startButtonText}>시작하기</ScaledText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompleted: {
    backgroundColor: '#F8F9FA',
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  pointText: {
    fontWeight: 'bold',
    color: '#FF9800',
  },
  title: {
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  titleCompleted: {
    color: '#6C757D',
  },
  subtitle: {
    color: '#6C757D',
    lineHeight: 20,
    marginBottom: 16,
  },
  subtitleCompleted: {
    color: '#ADB5BD',
  },
  startButton: {
    backgroundColor: '#02BFDC',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startButtonText: {
    fontWeight: '600',
    color: '#FFF',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  completedText: {
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default MissionCard;