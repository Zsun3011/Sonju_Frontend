import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useChat } from '../../contexts/ChatContext';
import { Chat } from '../../types/chat';
import { ChatStackParamList } from '../../types/navigation';
import { ChatStyles } from '../../styles/ChatStyles';
import { colors } from '../../styles/colors';
import ScaledText from '../../components/ScaledText';

type ChatListNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatList'>;

const ChatList = () => {
  const navigation = useNavigation<ChatListNavigationProp>();
  const { chats, selectChat, deleteChats } = useChat();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleChatPress = (chat: Chat) => {
    if (isSelectionMode) {
      toggleSelection(chat.id);
    } else {
      selectChat(chat.id);
      navigation.navigate('ChatRoom');
    }
  };

  const toggleSelection = (chatId: string) => {
    setSelectedItems((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]
    );
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      Alert.alert('알림', '삭제할 항목을 선택해주세요');
      return;
    }

    Alert.alert('삭제 확인', `${selectedItems.length}개의 대화를 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteChats(selectedItems);
          setSelectedItems([]);
          setIsSelectionMode(false);
        },
      },
    ]);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '어제';
    if (days < 7) return `${days}일 전`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={[ChatStyles.chatListItem, isSelected && ChatStyles.chatListItemSelected]}
        onPress={() => handleChatPress(item)}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleSelection(item.id);
        }}
        activeOpacity={0.7}
      >
        <View style={ChatStyles.chatListContent}>
          {/* 중간 글씨 20 */}
          <ScaledText style={ChatStyles.chatListTitle} numberOfLines={1} fontSize={20}>
            {item.title}
          </ScaledText>
          {/* 작은 글씨 18 */}
          <ScaledText style={ChatStyles.chatListDate} fontSize={18}>
            {formatDate(item.date)}
          </ScaledText>
        </View>
        {isSelectionMode && (
          <View style={[ChatStyles.checkbox, isSelected && ChatStyles.checkboxSelected]}>
            {isSelected && <Icon name="checkmark" size={16} color={colors.white} />}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={ChatStyles.container}>
      <View style={ChatStyles.container}>
        {/* 헤더 */}
        <View style={ChatStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ChatStyles.headerButton}>
            <Icon name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* 큰 글씨 24 */}
          <ScaledText style={ChatStyles.headerTitle} fontSize={24}>
            채팅 목록
          </ScaledText>

          {isSelectionMode ? (
            <TouchableOpacity style={ChatStyles.headerButton} onPress={handleDelete}>
              {/* 중간 글씨 20 */}
              <ScaledText style={ChatStyles.headerButtonPrimary} fontSize={20}>
                삭제
              </ScaledText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={ChatStyles.headerButton} onPress={() => setIsSelectionMode(true)}>
              {/* 중간 글씨 20 */}
              <ScaledText style={ChatStyles.headerButtonPrimary} fontSize={20}>
                선택
              </ScaledText>
            </TouchableOpacity>
          )}
        </View>

        {chats.length === 0 ? (
          <View style={ChatStyles.emptyContainer}>
            <Icon name="chatbubbles-outline" size={64} color={colors.border} />
            {/* 중간 글씨 20 */}
            <ScaledText style={ChatStyles.emptyText} fontSize={20}>
              채팅 내역이 없습니다
            </ScaledText>
            {/* 작은 글씨 18 */}
            <ScaledText style={ChatStyles.emptySubtext} fontSize={18}>
              손주와 새로운 대화를 시작해보세요
            </ScaledText>
          </View>
        ) : (
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}

        {isSelectionMode && (
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={ChatStyles.secondaryButton}
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedItems([]);
              }}
            >
              {/* 중간 글씨 20 */}
              <ScaledText style={ChatStyles.secondaryButtonText} fontSize={20}>
                취소
              </ScaledText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default ChatList;
