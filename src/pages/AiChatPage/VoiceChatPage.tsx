import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { voiceAPI } from '../../api/voice';
import { useChat } from '../../store/ChatContext';
import { chatStyles as s } from '../../styles/ChatStyles';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function VoiceChatPage({ navigation }: any) {
  const { sendMessage } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (isRecording) {
      startPulseAnimation();
    }
  }, [isRecording]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startRecording = async () => {
    try {
      const path = await audioRecorderPlayer.startRecorder();
      setAudioPath(path);
      setIsRecording(true);
    } catch (error) {
      console.error('녹음 시작 실패:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      
      // Whisper API로 음성을 텍스트로 변환
      const transcribedText = await voiceAPI.transcribeAudio(audioPath);
      
      // 채팅으로 전송
      await sendMessage(transcribedText, true);
      
      // 채팅 화면으로 돌아가기
      navigation.goBack();
    } catch (error) {
      console.error('녹음 중지 실패:', error);
    }
  };

  const cancelRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      navigation.goBack();
    } catch (error) {
      console.error('녹음 취소 실패:', error);
    }
  };

  return (
    <View style={s.voiceContainer}>
      {/* 헤더 */}
      <View style={s.header}>
        <TouchableOpacity onPress={cancelRecording}>
          <Text>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>돌쇠</Text>
        <View style={s.headerRight} />
      </View>

      {/* 캐릭터 & 애니메이션 */}
      <View style={s.voiceCenter}>
        <Animated.View
          style={[
            s.voiceCircle,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={s.characterContainer}>
            {/* 캐릭터 이미지 */}
          </View>
        </Animated.View>

        {/* 음성 파형 애니메이션 */}
        <View style={s.waveform}>
          <Text>🎵</Text>
        </View>

        <Text style={s.voiceStatus}>
          {isRecording ? '손주가 듣고 있어요.' : '말씀해주세요'}
        </Text>
      </View>

      {/* 컨트롤 버튼 */}
      <View style={s.voiceControls}>
        <TouchableOpacity style={s.controlButton}>
          <Text>📹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.controlButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text>{isRecording ? '⏸' : '🎤'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.controlButton} onPress={cancelRecording}>
          <Text>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}