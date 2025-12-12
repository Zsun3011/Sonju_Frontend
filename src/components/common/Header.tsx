import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScaledText from '../../components/ScaledText';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onStar?: () => void;
  onMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true, onStar, onMenu }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {/* 제목: 크게 24 */}
      <ScaledText style={styles.title} fontSize={24}>
        {title}
      </ScaledText>

      <View style={styles.rightSection}>
        {onStar && (
          <TouchableOpacity onPress={onStar} style={styles.iconButton}>
            <Icon name="star-outline" size={24} color="#333" />
          </TouchableOpacity>
        )}
        {onMenu && (
          <TouchableOpacity onPress={onMenu} style={styles.iconButton}>
            <Icon name="menu" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#B8E9F5',
    borderBottomWidth: 1,
    borderBottomColor: '#B8E6EA',
  },
  leftSection: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18, // ScaledText가 24 기준으로 스케일 적용
    fontWeight: '600',
    color: '#2D4550',
    textAlign: 'center',
  },
  rightSection: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
});

export default Header;
