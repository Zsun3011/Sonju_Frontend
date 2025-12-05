// src/components/chat/TodoSuggestion.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ScaledText from '../ScaledText';
import Icon from 'react-native-vector-icons/Ionicons';

interface TodoSuggestionProps {
  task: string;
  date?: string;
  time?: string;
  onAccept: () => void;
  onReject: () => void;
}

/**
 * AI가 할일 등록을 제안할 때 표시되는 컴포넌트
 * step="suggest" 일 때 사용
 */
const TodoSuggestion: React.FC<TodoSuggestionProps> = ({ task, date, time, onAccept, onReject }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="checkbox-outline" size={20} color="#02BFDC" />
      </View>
      
      <View style={styles.content}>
        <ScaledText fontSize={14} style={styles.label}>할일로 등록할까요?</ScaledText>
        <ScaledText fontSize={16} style={styles.task}>{task}</ScaledText>
        {(date || time) && (
          <ScaledText fontSize={14} style={styles.dateTime}>
            {date && date}
            {date && time && ' '}
            {time && time}
          </ScaledText>
        )}
        
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={onAccept}>
            <ScaledText fontSize={14} style={styles.acceptText}>예</ScaledText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={onReject}>
            <ScaledText fontSize={14} style={styles.rejectText}>아니요</ScaledText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E8F8FA',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#02BFDC',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  label: {
    color: '#7A9CA5',
    marginBottom: 4,
    fontWeight: '500',
  },
  task: {
    color: '#2D4550',
    fontWeight: '600',
    marginBottom: 4,
  },
  dateTime: {
    color: '#5B8A95',
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#02BFDC',
  },
  rejectButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8E6EA',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rejectText: {
    color: '#5B8A95',
    fontWeight: '600',
  },
});

export default TodoSuggestion;