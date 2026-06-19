import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sessionStorage } from '../../storage/sessionStorage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, Product } from '../../types';
import { useSessionHome } from '../../hooks/useSessionHome';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SessionHome'>;
  route: RouteProp<RootStackParamList, 'SessionHome'>;
};

// ── Skeleton card ─────────────────────────────

function SkeletonCard() {
  return (
    <View
      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-3"
      style={{ width: '48%' }}
    >
      <View className="h-28 bg-[#F0FDF4]" />
      <View className="p-3 gap-2">
        <View className="h-2 w-12 rounded-full bg-[#E5E7EB]" />
        <View className="h-3 w-20 rounded-full bg-[#F0FDF4]" />
        <View className="h-2 w-10 rounded-full bg-[#F0FDF4]" />
        <View className="mt-2 h-8 rounded-xl bg-[#F0FDF4]" />
      </View>
    </View>
  );
}

// ── Product card ──────────────────────────────

interface ProductCardProps {
  product: Product;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}

function ProductCard({ product, qty, onAdd, onRemove }: ProductCardProps) {
  return (
    <View
      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-3"
      style={{ width: '48%' }}
    >
      {/* Image */}
      <View className="h-28 bg-[#F8FAFC] items-center justify-center">
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <Text className="text-5xl">📦</Text>
        )}
      </View>

      {/* Info */}
      <View className="p-3">
        <Text className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide mb-0.5">
          {product.brand}
        </Text>
        <Text
          className="text-xs font-bold text-[#1F2937] leading-tight mb-1"
          numberOfLines={2}
        >
          {product.name}
        </Text>
        {product.metadata?.weightGrams && (
          <Text className="text-[10px] text-[#9CA3AF] mb-2">
            {product.metadata.weightGrams}g
          </Text>
        )}

        {/* Add / qty control */}
        {qty === 0 ? (
          <TouchableOpacity
            onPress={onAdd}
            activeOpacity={0.8}
            className="h-8 rounded-xl bg-[#166534] items-center justify-center"
          >
            <Text className="text-white text-xs font-bold">+ Add</Text>
          </TouchableOpacity>
        ) : (
          <View className="h-8 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex-row items-center justify-between px-2">
            <TouchableOpacity onPress={onRemove} className="w-6 h-6 items-center justify-center">
              <Text className="text-[#166534] text-base font-bold">−</Text>
            </TouchableOpacity>
            <Text className="text-[#166534] text-xs font-bold">{qty}</Text>
            <TouchableOpacity onPress={onAdd} className="w-6 h-6 items-center justify-center">
              <Text className="text-[#166534] text-base font-bold">+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────

export default function SessionHomeScreen({ navigation, route }: Props) {
  const { storeId, sessionToken, sessionId } = route.params;

  const {
    categories,
    products,
    isLoadingCats,
    isLoadingProducts,
    error,
    selectedCategoryId,
    setSelectedCategoryId,
    cart,
    cartCount,
    cartItems,
    addToCart,
    removeFromCart,
  } = useSessionHome(storeId, sessionToken);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', {
      sessionToken,
      categories,
    });
  }, [navigation, sessionToken, categories]);

  useEffect(() => {
  sessionStorage.save({ storeId, sessionToken, sessionId });
}, [storeId, sessionToken, sessionId]);

  return (
    <SafeAreaView className="flex-1 bg-[#F0FDF4]" edges={['top']}>

      {/* ── STICKY HEADER ── */}
      <View className="bg-white border-b border-[#BBF7D0]">

        {/* Logo + cart */}
        <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-[#166534] items-center justify-center">
              <Text className="text-white text-sm">✓</Text>
            </View>
            <Text className="text-[17px] font-bold text-[#166534] tracking-tight">
              GrocSpot
            </Text>
          </View>

          <TouchableOpacity className="w-9 h-9 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] items-center justify-center">
            <Text className="text-base">🛒</Text>
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

        {/* Store info card */}
        <View className="mx-4 mb-2 px-3 py-2 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <View>
              <Text className="text-xs font-semibold text-[#1F2937]">GrocSpot Store</Text>
              <Text className="text-[10px] text-[#6B7280]">Session active</Text>
            </View>
          </View>
          <View className="bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
            <Text className="text-[10px] font-bold text-[#166534]">Open</Text>
          </View>
        </View>

        {/* Search bar — tappable, opens Search screen */}
        <TouchableOpacity
          onPress={handleSearchPress}
          activeOpacity={0.8}
          className="mx-4 mb-2 px-3 py-2.5 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] flex-row items-center gap-2"
        >
          <Text className="text-base">🔍</Text>
          <Text className="text-[13px] text-[#9CA3AF] flex-1">
            Search milk, bread, fruits…
          </Text>
          <Text className="text-base">🎤</Text>
        </TouchableOpacity>

        {/* Category chips */}
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
            {/* All chip */}
            <TouchableOpacity
              onPress={() => setSelectedCategoryId('all')}
              className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                selectedCategoryId === 'all'
                  ? 'bg-[#166534] border-[#166534]'
                  : 'bg-white border-[#BBF7D0]'
              }`}
            >
              <Text className="text-sm">🛒</Text>
              <Text className={`text-xs font-semibold ${
                selectedCategoryId === 'all' ? 'text-white' : 'text-[#6B7280]'
              }`}>
                All
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.categoryId}
                onPress={() => setSelectedCategoryId(cat.categoryId)}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                  selectedCategoryId === cat.categoryId
                    ? 'bg-[#166534] border-[#166534]'
                    : 'bg-white border-[#BBF7D0]'
                }`}
              >                
                <Text className={`text-xs font-semibold ${
                  selectedCategoryId === cat.categoryId ? 'text-white' : 'text-[#6B7280]'
                }`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: cartCount > 0 ? 100 : 24 }}
      >
        {/* Promo banner */}
        <View className="mx-4 mt-4 mb-4 bg-[#166534] rounded-2xl px-4 py-4 flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-bold text-white">Fresh arrivals today 🌿</Text>
            <Text className="text-[11px] text-[#BBF7D0] mt-0.5">Organic produce, just stocked</Text>
          </View>
          <View className="bg-[#F59E0B] rounded-xl px-3 py-2 items-center">
            <Text className="text-white text-lg font-extrabold leading-none">15%</Text>
            <Text className="text-white text-[10px] font-semibold">OFF</Text>
          </View>
        </View>

        {/* Section label */}
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Text className="text-base font-bold text-[#1F2937]">
            {selectedCategoryId === 'all'
              ? 'All Products'
              : categories.find((c) => c.categoryId === selectedCategoryId)?.name ?? 'Products'}
          </Text>
          {!isLoadingProducts && (
            <Text className="text-xs text-[#6B7280]">
              {products.length} item{products.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Error state */}
        {error && (
          <View className="items-center justify-center py-16 px-8">
            <Text className="text-4xl mb-3">😕</Text>
            <Text className="text-sm font-bold text-[#1F2937] text-center mb-1">
              Something went wrong
            </Text>
            <Text className="text-xs text-[#6B7280] text-center">{error}</Text>
          </View>
        )}

        {/* Skeleton */}
        {isLoadingProducts && !error && (
          <View className="flex-row flex-wrap px-4 gap-[4%]">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        )}

        {/* Empty state */}
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

        {/* Product grid */}
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

      {/* ── STICKY CART BAR ── */}
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
            className="bg-[#22C55E] px-5 py-2.5 rounded-xl flex-row items-center gap-2"
            activeOpacity={0.85}
          >
            <Text className="text-white text-sm font-bold">View Cart</Text>
            <Text className="text-white text-sm">→</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}