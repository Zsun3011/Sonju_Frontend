import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoiceClick: () => void;
  onAttachClick?: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onVoiceClick,
  onAttachClick,
  disabled,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {onAttachClick && (
          <TouchableOpacity onPress={onAttachClick} style={styles.attachButton}>
            <Icon name="add-circle-outline" size={32} color="#02BFDC" />
          </TouchableOpacity>
        )}

        <View style={styles.inputWrapper}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="저에게 여쭤보세요."
            placeholderTextColor="#7A9CA5"
            editable={!disabled}
            style={styles.input}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={message.trim() ? handleSend : onVoiceClick}
            style={styles.voiceButton}
          >
            <Icon
              name={message.trim() ? "send" : "mic"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#B8E9F5',
    borderTopWidth: 1,
    borderTopColor: '#B8E6EA',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    borderWidth: 1,
    borderColor: '#B8E6EA',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 48,
    color: '#2D4550',
    maxHeight: 100,
  },
  voiceButton: {
    position: 'absolute',
    right: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#02BFDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput;