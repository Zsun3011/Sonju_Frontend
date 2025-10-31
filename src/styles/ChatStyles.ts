import { StyleSheet } from 'react-native';

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  
  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E8F4F8',
    borderBottomWidth: 1,
    borderBottomColor: '#D0E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  
  // 빈 상태
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginBottom: 40,
  },
  
  // 추천 질문
  suggestedTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#666',
    marginBottom: 16,
    alignSelf: 'flex-start',
    width: '100%',
  },
  suggestedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  suggestedButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0E8F0',
  },
  suggestedText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#333',
  },
  
  // 메시지 리스트
  messageList: {
    padding: 16,
  },
  
  // 입력 영역
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#D0E8F0',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 24,
    color: '#666',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#02BFDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
  },
  
  // 음성 채팅
  voiceContainer: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  voiceCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(2, 191, 220, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  characterContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  voiceStatus: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
  voiceControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // 프롬프트 설정
  settingContainer: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  settingHeader: {
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
  settingTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
  },
  settingSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#02BFDC',
    borderColor: '#02BFDC',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
  },
  checkmark: {
    fontSize: 16,
    color: '#fff',
    marginRight: 4,
  },
});