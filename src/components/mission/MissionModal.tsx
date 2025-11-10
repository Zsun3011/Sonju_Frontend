import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Mission } from '../../types/mission';
import { MissionStyles } from '../../styles/MissionStyles';

interface MissionModalProps {
  mission: Mission | null;
  visible: boolean;
  onClose: () => void;
  onStartChat: () => void;
}

const MissionModal: React.FC<MissionModalProps> = ({ mission, visible, onClose, onStartChat }) => {
  if (!mission) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={MissionStyles.modalOverlay}>
        <View style={MissionStyles.modalContainer}>
          <View style={MissionStyles.modalHeader}>
            <Text style={MissionStyles.modalTitle}>{mission.title}</Text>
            <View style={MissionStyles.tagContainer}>
              <Text style={MissionStyles.tag}>{mission.tag}</Text>
            </View>
          </View>

          <Text style={MissionStyles.modalDescription}>{mission.description}</Text>

          <TouchableOpacity
            style={MissionStyles.modalButton}
            onPress={onStartChat}
            activeOpacity={0.7}
          >
            <Text style={MissionStyles.modalButtonText}>채팅으로 이동</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MissionModal;