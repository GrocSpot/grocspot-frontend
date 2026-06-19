import { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sessionStorage } from '../../storage/sessionStorage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../types';
import { useSessionHome } from '../../hooks/useSessionHome';
import Svg, { Path } from 'react-native-svg';
import { SkeletonCard } from './components/SkeletonCard';
import { ProductCard } from './components/ProductCard';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SessionHome'>;
  route: RouteProp<RootStackParamList, 'SessionHome'>;
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function SessionHomeScreen({ navigation, route }: Props) {
  const { storeId, sessionToken, sessionId } = route.params;

  const {
    store,
    categories,
    products,
    isLoadingCats,
    isLoadingProducts,
    error,
    selectedCategoryId,
    setSelectedCategoryId,
    cart,
    cartCount,
    addToCart,
    removeFromCart,
  } = useSessionHome(storeId, sessionToken);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', { sessionToken, categories });
  }, [navigation, sessionToken, categories]);

  useEffect(() => {
    sessionStorage.save({ storeId, sessionToken, sessionId });
  }, [storeId, sessionToken, sessionId]);

  const sectionLabel =
    selectedCategoryId === 'all'
      ? 'All Products'
      : categories.find((c) => c.categoryId === selectedCategoryId)?.name ?? 'Products';

  return (
    <SafeAreaView className="flex-1 bg-[#F0FDF4]" edges={['top']}>
      <View className="bg-white border-b border-[#BBF7D0]">
        <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-[17px] font-bold text-[#166534] tracking-tight">
              GrocSpot
            </Text>
          </View>

          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] items-center justify-center"
            activeOpacity={0.7}
          >
            <Svg width={18} height={18} viewBox="0 0 448 512" fill="#166534">
              <Path d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z" />
            </Svg>
            {cartCount > 0 && (
              <View
                className="absolute -top-1 -right-1 bg-[#22C55E] rounded-full items-center justify-center border-2 border-white"
                style={{ width: 18, height: 18 }}
              >
                <Text className="text-white text-[9px] font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mx-4 mb-2 px-3 py-2 bg-white rounded-xl border border-[#BBF7D0] flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1 mr-2">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: store?.isActive === false ? '#EF4444' : '#22C55E' }}
            />
            <View className="flex-1">
              <Text className="text-xs font-semibold text-[#1F2937]" numberOfLines={1}>
                {store?.name ?? 'GrocSpot Store'}
              </Text>
              {store?.address ? (
                <Text className="text-[10px] text-[#6B7280]" numberOfLines={1}>
                  {store.address.split(',').slice(0, 3).join(',')}
                </Text>
              ) : (
                <Text className="text-[10px] text-[#6B7280]">Session active</Text>
              )}
            </View>
          </View>
          <View
            className="px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: store?.isActive === false ? '#FEE2E2' : '#DCFCE7' }}
          >
            <Text
              className="text-[10px] font-bold"
              style={{ color: store?.isActive === false ? '#DC2626' : '#166534' }}
            >
              {store?.isActive === false ? 'Closed' : 'Open'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSearchPress}
          activeOpacity={0.8}
          className="mx-4 mb-2 px-3 py-2.5 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] flex-row items-center gap-2"
        >
          <Svg width={16} height={16} viewBox="0 0 448 512" fill="#9CA3AF">
            <Path d="M448 449L301.2 300.2c20-27.9 31.9-62.2 31.9-99.2 0-93.1-74.7-168.9-166.5-168.9-91.9-.1-166.6 75.7-166.6 168.8S74.7 369.8 166.5 369.8c39.8 0 76.3-14.2 105-37.9L417.5 480 448 449zM166.5 330.8c-70.6 0-128.1-58.3-128.1-129.9S95.9 71 166.5 71 294.6 129.3 294.6 200.9 237.2 330.8 166.5 330.8z" />
          </Svg>
          <Text className="text-[13px] text-[#9CA3AF] flex-1">
            Search milk, bread, fruits…
          </Text>
        </TouchableOpacity>
        {isLoadingCats ? (
          <View className="h-10 items-center justify-center mb-2">
            <ActivityIndicator size="small" color="#166534" />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategoryId('all')}
              className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                selectedCategoryId === 'all'
                  ? 'bg-[#166534] border-[#166534]'
                  : 'bg-white border-[#BBF7D0]'
              }`}
            >
              <Text className={`text-xs font-semibold ${
                selectedCategoryId === 'all' ? 'text-white' : 'text-[#6B7280]'
              }`}>
                All
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => {
              const active = selectedCategoryId === cat.categoryId;
              return (
                <TouchableOpacity
                  key={cat.categoryId}
                  onPress={() => setSelectedCategoryId(cat.categoryId)}
                  className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                    active ? 'bg-[#166534] border-[#166534]' : 'bg-white border-[#BBF7D0]'
                  }`}
                >
                  <Text className={`text-xs font-semibold ${
                    active ? 'text-white' : 'text-[#6B7280]'
                  }`}>
                    {cap(cat.name)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: cartCount > 0 ? 100 : 24 }}
      >
        {/* Promo banner */}
        <View className="mx-4 mt-4 mb-4 bg-[#166534] rounded-2xl px-4 py-4 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-sm font-bold text-white">Fresh arrivals today 🌿</Text>
            <Text className="text-[11px] text-[#BBF7D0] mt-0.5">
              Organic produce, just stocked
            </Text>
          </View>
          <View className="bg-[#F59E0B] rounded-xl px-3 py-2 items-center">
            <Text className="text-white text-lg font-extrabold leading-none">15%</Text>
            <Text className="text-white text-[10px] font-semibold">OFF</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Text className="text-base font-bold text-[#1F2937]">{sectionLabel}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-xs font-semibold text-[#166534]">See all →</Text>
          </TouchableOpacity>
        </View>
        {error && (
          <View className="items-center justify-center py-16 px-8">
            <Text className="text-4xl mb-3">😕</Text>
            <Text className="text-sm font-bold text-[#1F2937] text-center mb-1">
              Something went wrong
            </Text>
            <Text className="text-xs text-[#6B7280] text-center">{error}</Text>
          </View>
        )}
        {isLoadingProducts && !error && (
          <View className="flex-row flex-wrap px-4 gap-[4%]">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        )}
        {!isLoadingProducts && !error && products.length === 0 && (
          <View className="items-center justify-center py-16 px-8">
            <Text className="text-4xl mb-3">🔍</Text>
            <Text className="text-sm font-bold text-[#1F2937] text-center mb-1">
              No products found
            </Text>
            <Text className="text-xs text-[#6B7280] text-center">
              Try a different category
            </Text>
          </View>
        )}
        {!isLoadingProducts && !error && products.length > 0 && (
          <View className="flex-row flex-wrap px-4 gap-[4%]">
            {products.map((product) => {
              const item = cart.get(product.productId);
              return (
                <ProductCard
                  key={product.productId}
                  product={product}
                  qty={item?.qty ?? 0}
                  onAdd={() => addToCart(product)}
                  onRemove={() => removeFromCart(product.productId)}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
      {cartCount > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-[#166534] px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="bg-white/20 px-2.5 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">
                {cartCount} item{cartCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-white px-5 py-2.5 rounded-xl flex-row items-center gap-2"
            activeOpacity={0.85}
          >
            <Text className="text-[#166534] text-sm font-bold">View Cart</Text>
            <Text className="text-[#166534] text-sm">→</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}