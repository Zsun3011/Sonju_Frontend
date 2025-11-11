import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SuggestedQuestionProps {
  question: string;
  onClick: (question: string) => void;
}

const SuggestedQuestion: React.FC<SuggestedQuestionProps> = ({ question, onClick }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onClick(question)}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{question}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E8F7FA',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: '#2D4550',
    textAlign: 'left',
  },
});

export default SuggestedQuestion;