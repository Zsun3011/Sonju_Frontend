// src/pages/TodoPage/TodoSection.tsx

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import ScaledText from '../../components/ScaledText';
import { TodoItem } from './types';
import { styles } from '../../styles/Todo';

interface TodoSectionProps {
  section: string;
  items: TodoItem[];
  onToggle: (id: string) => void;
  onEdit: (todo: TodoItem) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  section,
  items,
  onToggle,
  onEdit,
  formatDate,
  formatTime,
}) => {
  if (items.length === 0) return null; // 기존 코드처럼 빈 섹션은 표시 안 함

  return (
    <View style={styles.section}>
      <ScaledText fontSize={18} style={styles.sectionTitle}>
        {section}
      </ScaledText>

      {items.map((todo) => (
        <TouchableOpacity
          key={todo.id}
          style={styles.todoItem}
          onPress={() => onEdit(todo)}
        >
          <TouchableOpacity
            style={[
              styles.checkbox,
              todo.completed && styles.checkboxCompleted,
            ]}
            onPress={() => onToggle(todo.id)}
          >
            {todo.completed && (
              <ScaledText fontSize={16} style={styles.checkmark}>
                ✓
              </ScaledText>
            )}
          </TouchableOpacity>

          <View style={styles.todoContent}>
            <ScaledText
              fontSize={20}
              style={[
                styles.todoTitle,
                todo.completed && styles.todoTitleCompleted,
              ]}
            >
              {todo.title}
            </ScaledText>
            <ScaledText fontSize={16} style={styles.todoDate}>
              {formatDate(todo.dueDate)}
              {!todo.isAllDay && ` ${formatTime(todo.dueDate)}`}
            </ScaledText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
