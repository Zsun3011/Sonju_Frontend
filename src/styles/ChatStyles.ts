// src/styles/ChatStyles.ts
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const ChatStyles = StyleSheet.create({
  // ========== 컨테이너 스타일 ==========
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ========== 헤더 스타일 ==========
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  headerButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  headerButtonPrimary: {
    color: colors.primary,
    fontWeight: '600',
  },

  // ========== 캐릭터 컨테이너 ==========
  characterContainer: {
    width: 120,
    height: 120,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  characterLarge: {
    width: 250,
    height: 250,
  },
  characterSmall: {
    width: 150,
    height: 150,
  },
  characterImage: {
    width: '80%',
    height: '80%',
  },
  characterPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: colors.border,
  },

  // ========== Glow 효과 ==========
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(2, 191, 220, 0.2)',
    borderRadius: 128,
    opacity: 0.6,
  },
  glowOuter: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(2, 191, 220, 0.3)',
  },
  glowInner: {
    width: '80%',
    height: '80%',
    backgroundColor: 'rgba(2, 191, 220, 0.2)',
  },
  glowActive: {
    opacity: 0.8,
  },

  // ========== 채팅 메시지 스타일 ==========
  messageContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    borderTopRightRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  assistantBubble: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.white,
  },
  assistantMessageText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  // ========== 입력창 스타일 ==========
  inputContainer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 48,
    color: colors.text,
    maxHeight: 100,
  },
  voiceButton: {
    position: 'absolute',
    right: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========== 추천 질문 스타일 ==========
  suggestionsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionItem: {
    flexBasis: '48%',
  },
  suggestionButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'left',
  },

  // ========== 채팅 목록 스타일 ==========
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chatListItemSelected: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chatListContent: {
    flex: 1,
  },
  chatListTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  chatListDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // ========== 프롬프트 설정 스타일 ==========
  promptCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  promptDescription: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  promptList: {
    paddingHorizontal: 32,
    gap: 16,
  },
  promptItem: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  promptItemSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },
  promptLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  promptLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },

  // ========== 음성 채팅 스타일 ==========
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 60,
    marginBottom: 24,
  },
  waveBar: {
    width: 4,
    backgroundColor: colors.textSecondary,
    borderRadius: 2,
  },
  voiceControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 48,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
  },

  // ========== 공통 텍스트 스타일 ==========
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 24,
  },
  statusTextMuted: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  bodyText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  captionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // ========== 빈 상태 스타일 ==========
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // ========== 버튼 스타일 ==========
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  deleteButton: {
    height: 56,
    paddingHorizontal: 48,
    backgroundColor: colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },

  // ========== 레이아웃 헬퍼 ==========
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: 16,
  },
  spacerLarge: {
    height: 32,
  },

  // ========== 로딩 스타일 ==========
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});