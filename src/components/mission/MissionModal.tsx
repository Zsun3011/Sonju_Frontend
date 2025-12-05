import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import ScaledText from '../ScaledText';
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
            <ScaledText fontSize={20} style={MissionStyles.modalTitle}>{mission.title}</ScaledText>
            <View style={MissionStyles.tagContainer}>
              <ScaledText fontSize={12} style={MissionStyles.tag}>{mission.tag}</ScaledText>
            </View>
          </View>

          <ScaledText fontSize={16} style={MissionStyles.modalDescription}>{mission.description}</ScaledText>

          <TouchableOpacity
            style={MissionStyles.modalButton}
            onPress={onStartChat}
            activeOpacity={0.7}
          >
            <ScaledText fontSize={16} style={MissionStyles.modalButtonText}>채팅으로 이동</ScaledText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MissionModal;