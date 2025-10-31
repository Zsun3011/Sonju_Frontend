import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useChat } from '../../store/ChatContext';

export default function ChatListPage({ navigation }: any) {
  const { chats, selectChat, toggleFavorite } = useChat();

  const handleChatPress = (chatId: string) => {
    selectChat(chatId);
    navigation.navigate('AIChat');
  };

  const handleFavoritePress = (chatId: string, e: any) => {
    e.stopPropagation();
    toggleFavorite(chatId);
  };

  const renderChatItem = ({ item }: any) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const preview = lastMessage?.content.slice(0, 50) || '메시지가 없습니다';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item.id)}
      >
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>{item.title}</Text>
            <TouchableOpacity onPress={(e) => handleFavoritePress(item.id, e)}>
              <Text style={styles.favoriteIcon}>
                {item.isFavorite ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.chatPreview} numberOfLines={2}>
            {preview}
          </Text>
          <Text style={styles.chatTime}>
            {new Date(item.updatedAt).toLocaleDateString('ko-KR')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채팅 목록</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 채팅 목록 */}
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 채팅 기록이 없습니다</Text>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => navigation.navigate('AIChat')}
          >
            <Text style={styles.newChatButtonText}>새 채팅 시작하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#D0E8F0',
  },
  backButton: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },
  headerRight: {
    width: 24,
  },
  listContent: {
    padding: 16,
  },
  chatItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  chatPreview: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  chatTime: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  newChatButton: {
    backgroundColor: '#02BFDC',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  newChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
  },
});