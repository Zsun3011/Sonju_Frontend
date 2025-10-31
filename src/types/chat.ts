export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  uri: string;
  name: string;
  size: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptSettings {
  personality: '다정한' | '활발한' | '경청하는' | '유머러스한';
  tone: '존댓말' | '귀여운' | '부드러운';
  emotionalExpression: '적당히' | '평범한' | '농담조금' | '풍부하게';
  interests: Array<'뉴스' | '요리' | '운동' | '취미추천'>;
}