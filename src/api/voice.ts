import Voice from '@react-native-voice/voice';

// OpenAI Whisper API 키
const OPENAI_API_KEY = 'your-openai-api-key';

export interface VoiceRecognitionResult {
  text: string;
  confidence?: number;
}

export const voiceAPI = {
  // 음성을 텍스트로 변환 (STT - OpenAI Whisper)
  transcribeAudio: async (audioFilePath: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: audioFilePath,
        type: 'audio/m4a',
        name: 'audio.m4a',
      } as any);
      formData.append('model', 'whisper-1');
      formData.append('language', 'ko'); // 한국어

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('음성 인식 실패:', error);
      throw error;
    }
  },

  // 텍스트를 음성으로 변환 (TTS - 선택사항)
  textToSpeech: async (text: string): Promise<string> => {
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'alloy',
          input: text,
        }),
      });

      // 음성 파일 저장 로직
      // ... 구현
      
      return 'audio-file-path';
    } catch (error) {
      console.error('음성 합성 실패:', error);
      throw error;
    }
  },
};

// React Native Voice 헬퍼
export const voiceHelper = {
  startRecording: async () => {
    try {
      await Voice.start('ko-KR');
    } catch (error) {
      console.error('녹음 시작 실패:', error);
    }
  },

  stopRecording: async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('녹음 중지 실패:', error);
    }
  },

  cancelRecording: async () => {
    try {
      await Voice.cancel();
    } catch (error) {
      console.error('녹음 취소 실패:', error);
    }
  },
};