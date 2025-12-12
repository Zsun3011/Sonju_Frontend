import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Mission } from '../../types/mission';
import { MissionStyles } from '../../styles/MissionStyles';
import ScaledText from '../../components/ScaledText';

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
            {/* 모달 제목: 크게 24 */}
            <ScaledText style={MissionStyles.modalTitle} fontSize={24}>
              {mission.title}
            </ScaledText>
            <View style={MissionStyles.tagContainer}>
              {/* 태그: 작게 18 */}
              <ScaledText style={MissionStyles.tag} fontSize={18}>
                {mission.tag}
              </ScaledText>
            </View>
          </View>

          {/* 설명: 작게 18 */}
          <ScaledText style={MissionStyles.modalDescription} fontSize={18}>
            {mission.description}
          </ScaledText>

          <TouchableOpacity
            style={MissionStyles.modalButton}
            onPress={onStartChat}
            activeOpacity={0.7}
          >
            {/* 버튼 텍스트: 중간 20 */}
            <ScaledText style={MissionStyles.modalButtonText} fontSize={20}>
              채팅으로 이동
            </ScaledText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MissionModal;
