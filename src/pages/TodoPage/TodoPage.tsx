import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  SafeAreaView,
  Animated,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Voice from '@react-native-voice/voice';
import ScaledText from '../../components/ScaledText';


interface TodoItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  date: string;
}

const TodoListApp = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('오전');
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('00');
  const [isListening, setIsListening] = useState(false);
  const [buttonAnimation] = useState(new Animated.Value(0));
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  const today = new Date().toDateString();

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  useEffect(() => {
    Animated.spring(buttonAnimation, {
      toValue: showButtons ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [showButtons]);

  const loadTodos = async () => {
    try {
      const saved = await AsyncStorage.getItem('todos');
      if (saved) {
        const parsed = JSON.parse(saved);
        const todayTodos = parsed.filter((todo: TodoItem) => todo.date === today);
        setTodos(todayTodos);
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  };

  const handleAddTodo = () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요');
      return;
    }

    if (editingTodo) {
      // 수정 모드
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id
          ? { ...todo, title: title.trim(), time: `${period} ${hour}:${minute}` }
          : todo
      ));
      Alert.alert('성공', '할 일이 수정되었습니다');
    } else {
      // 추가 모드
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        title: title.trim(),
        time: `${period} ${hour}:${minute}`,
        completed: false,
        date: today,
      };
      setTodos([...todos, newTodo]);
      Alert.alert('성공', '할 일이 추가되었습니다');
    }

    setTitle('');
    setHour('9');
    setMinute('00');
    setPeriod('오전');
    setEditingTodo(null);
    setIsDialogOpen(false);
    setShowButtons(false);
  };

  // 테스트용 음성 인식 시뮬레이션
  const handleVoiceInput = async () => {
    setIsListening(true);
    Alert.alert('음성 인식', '듣고 있습니다...');

    // 테스트용 시뮬레이션 (3초 후 샘플 텍스트 입력)
    setTimeout(() => {
      setTitle('장보기');
      setIsListening(false);
      Alert.alert('완료', '음성이 인식되었습니다');
    }, 3000);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    Alert.alert(
      '삭제',
      '이 할 일을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            setTodos(todos.filter(todo => todo.id !== id));
            Alert.alert('완료', '삭제되었습니다');
          },
        },
      ]
    );
  };

  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setTitle(todo.title);

    // 시간 파싱
    const timeParts = todo.time.split(' ');
    setPeriod(timeParts[0]);
    const [h, m] = timeParts[1].split(':');
    setHour(h);
    setMinute(m);

    setIsDialogOpen(true);
  };

  const writeButtonTranslate = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const voiceButtonTranslate = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ScaledText fontSize={24} style={styles.title}>할 일</ScaledText>
      </View>

      <ScaledText fontSize={20} style={styles.subtitle}>목록을 적어 실천해요.</ScaledText>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onTouchStart={() => showButtons && setShowButtons(false)}
      >
        {todos.map((todo) => (
          <View key={todo.id} style={styles.todoCard}>
            <TouchableOpacity
              onPress={() => toggleTodo(todo.id)}
              style={[
                styles.checkbox,
                todo.completed && styles.checkboxCompleted
              ]}
            >
              {todo.completed && (
                <Image
                    source={require('../../../assets/images/체크아이콘.png')}
                    style={styles.checkIcon}
                    resizeMode="contain"
                  />
              )}
            </TouchableOpacity>

            <View style={styles.todoContent}>
              <Text style={[
                styles.todoTitle,
                todo.completed && styles.todoTitleCompleted
              ]}>
                {todo.title}
              </Text>
            </View>

            <Text style={[
              styles.todoTime,
              todo.completed && styles.todoTitleCompleted
            ]}>
              {todo.time}
            </Text>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleEditTodo(todo)}
            >
              <Image
                source={require('../../../assets/images/수정아이콘.png')}
                style={[
                  styles.icon1,
                  todo.completed && styles.iconGray
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => deleteTodo(todo.id)}
            >
              <Image
               source={require('../../../assets/images/쓰레기통아이콘.png')}
                style={[
                  styles.icon2,
                  todo.completed && styles.iconGray
                ]}
               resizeMode="contain"
             />
            </TouchableOpacity>
          </View>
        ))}

        {todos.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>할 일이 없습니다</Text>
          </View>
        )}
      </ScrollView>

      {/* Background overlay when buttons are shown */}
      {showButtons && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowButtons(false)}
        />
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {showButtons && (
          <>
            <Animated.View
              style={[
                styles.secondaryFab,
                { transform: [{ translateY: writeButtonTranslate }], opacity: buttonAnimation }
              ]}
            >
              <TouchableOpacity
                style={[styles.fabButton, styles.secondaryFabButton]}
                onPress={() => {
                  setIsDialogOpen(true);
                  setShowButtons(false);
                }}
              >
                <Image
                  source={require('../../../assets/images/직접쓰기.png')}
                  resizeMode="contain"
                />
                <Text style={styles.fabButtonText}>직접 쓰기</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.secondaryFab,
                { transform: [{ translateY: voiceButtonTranslate }], opacity: buttonAnimation }
              ]}
            >
              <TouchableOpacity
                style={[styles.fabButton, styles.secondaryFabButton]}
                onPress={() => {
                  setIsDialogOpen(true);
                  setShowButtons(false);
                  setTimeout(handleVoiceInput, 300);
                }}
              >
                <Image
                  source={require('../../../assets/images/받아쓰기.png')}
                  resizeMode="contain"
                />
                <Text style={styles.fabButtonText}>받아쓰기</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <TouchableOpacity
          style={[styles.fabButton, styles.mainFabButton]}
          onPress={() => setShowButtons(!showButtons)}
        >
          <Image
            source={require('../../../assets/images/플러스아이콘.png')}
            style={styles.plusIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Add/Edit Todo Modal */}
      <Modal
        visible={isDialogOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsDialogOpen(false);
          setEditingTodo(null);
          setTitle('');
          setHour('9');
          setMinute('00');
          setPeriod('오전');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTodo ? '할 일 수정' : '오늘 할 일'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>제목</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="제목"
                placeholderTextColor="#999"
              />
              {isListening && (
                <Text style={styles.listeningText}>듣고 있습니다...</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>시간</Text>
              <View style={styles.timePickerRow}>
                <View style={styles.picker}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setPeriod(period === '오전' ? '오후' : '오전')}
                  >
                    <Text style={styles.pickerText}>{period}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.picker}>
                  <TextInput
                    style={styles.pickerInput}
                    value={hour}
                    onChangeText={setHour}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>

                <View style={styles.picker}>
                  <TextInput
                    style={styles.pickerInput}
                    value={minute}
                    onChangeText={setMinute}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsDialogOpen(false);
                  setEditingTodo(null);
                  setTitle('');
                  setHour('9');
                  setMinute('00');
                  setPeriod('오전');
                }}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              {editingTodo && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={() => {
                    setIsDialogOpen(false);
                    deleteTodo(editingTodo.id);
                    setEditingTodo(null);
                    setTitle('');
                  }}
                >
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddTodo}
              >
                <Text style={styles.addButtonText}>
                  {editingTodo ? '저장' : '추가하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ' #D9F2F5',
  },
  header: {
    fontFamily: 'Pretendard-Medium',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
    color: '#000000',
  },
  subtitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#000000',
    paddingHorizontal: 40,
    marginTop: 4,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  todoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 27,
    height: 27,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#B7B7B7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#02BFDC',
    borderColor: '#02BFDC',
  },

  checkIcon:{
    width: 20,
    height: 20
  },

  icon1: {
    width: 30,
    height: 30
  },

   icon2: {
    width: 24,
    height: 24
  },

  iconGray: {
    opacity: 0.3,
  },

  plusIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFF',
  },

  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 20,
    color: '#000',
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  todoTime: {
    fontSize: 20,
    color: '#000',
  },
  iconButton: {
    padding: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },

  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: 130
  },
  secondaryFab: {
    marginBottom: 8,
  },

  fabButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 1,
  },

  mainFabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#02BFDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryFabButton: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    maxWidth: 190,
    paddingVertical: 30,
    borderRadius: 30,
    backgroundColor: '#02BFDC',
    alignItems: 'center',
    gap: 8,
  },
  fabButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  listeningText: {
    fontSize: 14,
    color: '#02BFDC',
    marginTop: 8,
  },
  timePickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  pickerButton: {
    padding: 12,
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  pickerInput: {
    padding: 12,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  addButton: {
    backgroundColor: '#02BFDC',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

export default TodoListApp;