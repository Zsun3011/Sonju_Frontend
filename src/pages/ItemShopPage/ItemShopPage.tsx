import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import PageHeader from '../../components/common/PageHeader';
import { usePoints } from '../../contexts/PointContext';
import { shopAPI } from '../../services/shop';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: any;
  category: 'accessory' | 'hat' | 'clothing';
  itemNumber: number;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'ribbon',
    name: '리본',
    price: 15,
    imageUrl: require('../../../assets/images/리본.png'),
    category: 'accessory',
    itemNumber: 1,
  },
  {
    id: 'glasses',
    name: '교복',
    price: 20,
    imageUrl: require('../../../assets/images/안경.png'),
    category: 'hat',
    itemNumber: 2,
  },
  {
    id: 'hiking-hat',
    name: '등산 모자',
    price: 20,
    imageUrl: require('../../../assets/images/등산모자.png'),
    category: 'hat',
    itemNumber: 3,
  },
  {
    id: 'bunny-band',
    name: '토끼 머리띠',
    price: 20,
    imageUrl: require('../../../assets/images/토끼머리띠.png'),
    category: 'accessory',
    itemNumber: 4,
  },
  {
    id: 'wizard-hat',
    name: '마법사 모자',
    price: 20,
    imageUrl: require('../../../assets/images/마법사모자.png'),
    category: 'hat',
    itemNumber: 5,
  },
  {
    id: 'crown',
    name: '왕관',
    price: 20,
    imageUrl: require('../../../assets/images/왕관.png'),
    category: 'accessory',
    itemNumber: 6,
  },
];

export default function ShopPage({ navigation }: any) {
  const { points, deductPoints, refreshPoints } = usePoints();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [equippedItems, setEquippedItems] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadEquippedItems();
      refreshPoints(); // 포커스될 때마다 포인트 갱신
    }, [])
  );

  const loadPurchasedItems = async () => {
    try {
      const saved = await AsyncStorage.getItem('purchasedItems');
      if (saved) {
        setPurchasedItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('구매 내역 로드 실패:', error);
    }
  };

  const loadEquippedItems = async () => {
    try {
      const equipped = await AsyncStorage.getItem('equippedItems');
      if (equipped) {
        setEquippedItems(JSON.parse(equipped));
      }
    } catch (error) {
      console.error('착용 아이템 로드 실패:', error);
    }
  };

  const getCharacterImage = () => {
    const equippedItemIds = Object.values(equippedItems);

    if (equippedItemIds.includes('ribbon')) {
      return require('../../../assets/images/리본손주.png');
    }
    if (equippedItemIds.includes('hiking-hat')) {
      return require('../../../assets/images/등산손주.png');
    }
    if (equippedItemIds.includes('bunny-band')) {
      return require('../../../assets/images/토끼손주.png');
    }
    if (equippedItemIds.includes('wizard-hat')) {
      return require('../../../assets/images/마법사손주.png');
    }
    if (equippedItemIds.includes('crown')) {
      return require('../../../assets/images/왕손주.png');
    }
    if (equippedItemIds.includes('glasses')) {
      return require('../../../assets/images/교복손주.png');
    }

    return require('../../../assets/images/sonjusmile.png');
  };

  const handlePurchase = async (item: ShopItem) => {
    if (purchasedItems.includes(item.id)) {
      Alert.alert('알림', '이미 구매한 아이템입니다.');
      return;
    }

    if (points < item.price) {
      Alert.alert('포인트 부족', '포인트가 부족합니다!');
      return;
    }

    Alert.alert(
      '구매 확인',
      `${item.name}을(를) ${item.price} 포인트에 구매하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '구매',
          onPress: async () => {
            setLoading(true);
            try {
              // 1. 백엔드 API 호출 - 아이템 구매
              const response = await shopAPI.purchaseItem(item.itemNumber);
              console.log('✅ 구매 API 응답:', response.message);

              // 2. 포인트 차감 (로컬)
              deductPoints(item.price);

              // 3. 구매 내역 저장 (로컬)
              const newPurchased = [...purchasedItems, item.id];
              setPurchasedItems(newPurchased);
              await AsyncStorage.setItem(
                'purchasedItems',
                JSON.stringify(newPurchased)
              );

              // 4. 서버에서 최신 포인트 조회
              await refreshPoints();

              // 5. 성공 메시지 (백엔드 응답 메시지 사용)
              Alert.alert('구매 완료', response.message || `${item.name}을(를) 구매했습니다!`);
            } catch (error: any) {
              console.error('❌ 구매 실패:', error);
              Alert.alert(
                '오류',
                error.message || '아이템 구매에 실패했습니다. 다시 시도해주세요.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEquip = async (itemId: string, category: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    try {
      // 기존 착용 아이템이 있으면 경고
      if (Object.keys(equippedItems).length > 0) {
        Alert.alert(
          '아이템 교체',
          '이미 착용 중인 아이템이 있습니다. 교체하시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '교체',
              onPress: async () => {
                setLoading(true);
                try {
                  // 백엔드 API 호출 - 아이템 장착
                  const response = await shopAPI.equipItem(item.itemNumber);
                  console.log('✅ 장착 API 응답:', response.message);

                  // 모든 아이템 해제 후 새 아이템만 착용 (로컬)
                  const newEquipped = { [category]: itemId };
                  setEquippedItems(newEquipped);
                  await AsyncStorage.setItem(
                    'equippedItems',
                    JSON.stringify(newEquipped)
                  );

                } catch (error: any) {
                  console.error('❌ 장착 실패:', error);
                  Alert.alert(
                    '오류',
                    error.message || '아이템 장착에 실패했습니다. 다시 시도해주세요.'
                  );
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
      } else {
        // 착용 중인 아이템이 없으면 바로 착용
        setLoading(true);
        try {
          // 백엔드 API 호출 - 아이템 장착
          const response = await shopAPI.equipItem(item.itemNumber);
          console.log('✅ 장착 API 응답:', response.message);

          const newEquipped = { [category]: itemId };
          setEquippedItems(newEquipped);
          await AsyncStorage.setItem(
            'equippedItems',
            JSON.stringify(newEquipped)
          );

          // 성공 메시지 (백엔드 응답 메시지 사용)
          Alert.alert('착용 완료', response.message || `아이템이 장착되었습니다!`);
        } catch (error: any) {
          console.error('❌ 장착 실패:', error);
          Alert.alert(
            '오류',
            error.message || '아이템 장착에 실패했습니다. 다시 시도해주세요.'
          );
        } finally {
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error('❌ 착용 처리 오류:', error);
    }
  };

  const handleUnequip = async (category: string) => {
    setLoading(true);
    try {
      // 백엔드 API 호출 - 아이템 장착 해제
      const response = await shopAPI.unequipItem();
      console.log('✅ 해제 API 응답:', response.message);

      // 로컬에서도 해제
      const newEquipped = { ...equippedItems };
      delete newEquipped[category];
      setEquippedItems(newEquipped);
      await AsyncStorage.setItem(
        'equippedItems',
        JSON.stringify(newEquipped)
      );

      // 성공 메시지 (백엔드 응답 메시지 사용)
      Alert.alert('해제 완료', response.message || '아이템을 해제했습니다.');
    } catch (error: any) {
      console.error('❌ 해제 실패:', error);
      Alert.alert(
        '오류',
        error.message || '아이템 장착 해제에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderShopItem = (item: ShopItem) => {
    const isPurchased = purchasedItems.includes(item.id);
    const isEquipped = equippedItems[item.category] === item.id;
    const canAfford = points >= item.price;

    return (
      <View key={item.id} style={styles.itemCard}>
        <TouchableOpacity
          onPress={() => !isPurchased && !loading && handlePurchase(item)}
          disabled={isPurchased || loading}
        >
          <View
            style={[
              styles.itemImageContainer,
              isEquipped && styles.equippedItemContainer,
            ]}
          >
            <Image
              source={item.imageUrl}
              style={styles.itemImage}
              resizeMode="contain"
            />
          </View>

          <ScaledText fontSize={16} style={styles.itemName}>
            {item.name}
          </ScaledText>
        </TouchableOpacity>

        {isPurchased ? (
          isEquipped ? (
            <TouchableOpacity
              style={[styles.unequipButton, loading && styles.buttonDisabled]}
              onPress={() => !loading && handleUnequip(item.category)}
              disabled={loading}
            >
              <ScaledText fontSize={14} style={styles.unequipText}>
                해제하기
              </ScaledText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.equipButton, loading && styles.buttonDisabled]}
              onPress={() => !loading && handleEquip(item.id, item.category)}
              disabled={loading}
            >
              <ScaledText fontSize={14} style={styles.equipText}>
                착용하기
              </ScaledText>
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity
            style={[
              styles.priceButton,
              (!canAfford || loading) && styles.priceButtonDisabled,
            ]}
            onPress={() => !loading && handlePurchase(item)}
            disabled={!canAfford || loading}
          >
            <ScaledText
              fontSize={14}
              style={[
                styles.priceText,
                (!canAfford || loading) && styles.priceTextDisabled,
              ]}
            >
              {item.price} 포인트
            </ScaledText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 배경 이미지 */}
      <Image
        source={require('../../../assets/images/배경.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 로딩 오버레이 */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#02BFDC" />
            <ScaledText fontSize={16} style={styles.loadingText}>
              처리 중...
            </ScaledText>
          </View>
        </View>
      )}

      {/* 헤더 */}
      <PageHeader title="상점" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!loading}
      >
        {/* 설명 텍스트 */}
        <ScaledText fontSize={18} style={styles.description}>
          마음에 드는 아이템을 구매해요.
        </ScaledText>

        {/* 캐릭터 영역 */}
        <View style={styles.characterSection}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            돌쇠의 현재 모습
          </ScaledText>

          <View style={styles.characterPreview}>
            <Image
              source={getCharacterImage()}
              style={styles.characterImage}
              resizeMode="contain"
            />

            {/* 착용 중인 아이템 표시 */}
            {Object.keys(equippedItems).length > 0 && (
              <View style={styles.equippedItemsDisplay}>
                <ScaledText fontSize={14} style={styles.equippedText}>
                  착용 중:{' '}
                  {Object.values(equippedItems)
                    .map(itemId => {
                      const item = SHOP_ITEMS.find(i => i.id === itemId);
                      return item?.name;
                    })
                    .filter(Boolean)
                    .join(', ')}
                </ScaledText>
              </View>
            )}
          </View>

          {/* 포인트 표시 */}
          <View style={styles.pointContainer}>
            <ScaledText fontSize={24} style={styles.pointText}>
              {points} 포인트
            </ScaledText>
            <Image
              source={require('../../../assets/images/코인.png')}
              style={styles.coinIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* 아이템 그리드 */}
        <View style={styles.itemGrid}>
          {SHOP_ITEMS.sort((a, b) => {
            const aOwned = purchasedItems.includes(a.id);
            const bOwned = purchasedItems.includes(b.id);
            if (aOwned && !bOwned) return -1;
            if (!aOwned && bOwned) return 1;
            return 0;
          }).map(item => renderShopItem(item))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F9FB',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    fontFamily: 'Pretendard-Medium',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  description: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  characterSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Pretendard-Bold',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  characterPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    width: '100%',
  },
  characterImage: {
    width: 250,
    height: 250,
  },
  equippedItemsDisplay: {
    marginTop: 15,
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#02BFDC',
  },
  equippedText: {
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
    textAlign: 'center',
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pointText: {
    fontFamily: 'Pretendard-Medium',
    color: '#1F2937',
  },
  coinIcon: {
    width: 24,
    height: 24,
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  itemCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#5F6C7B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  equippedItemContainer: {
    borderWidth: 3,
    borderColor: '#02BFDC',
  },
  itemImage: {
    width: '70%',
    height: '70%',
  },
  itemName: {
    fontFamily: 'Pretendard-Medium',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceButton: {
    backgroundColor: '#02BFDC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  priceButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  priceText: {
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    fontSize: 12,
  },
  priceTextDisabled: {
    color: '#9CA3AF',
  },
  equipButton: {
    backgroundColor: '#02BFDC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  equipText: {
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    fontSize: 12,
  },
  unequipButton: {
    backgroundColor: '#9CA3AF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  unequipText: {
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    fontSize: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});