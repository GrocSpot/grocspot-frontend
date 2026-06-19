import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, Store, Category, Product } from '../../types';
import { ENV } from '../../config/env';
import { sessionStorage } from '../../storage/sessionStorage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SessionHome'>;
  route: RouteProp<RootStackParamList, 'SessionHome'>;
};

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function formatDay(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const isVeg = product.metadata?.isVegetarian;
  const weight = product.metadata?.weightGrams;

  return (
    <View
      className="bg-white rounded-2xl border border-[#D4E6DC] p-4"
      style={{ width: '47%' }}
    >
      {/* Veg / Non-veg dot */}
      <View className="flex-row items-center justify-between mb-2">
        <View
          className={`w-4 h-4 rounded-sm border-2 items-center justify-center ${
            isVeg ? 'border-[#2D7A4F]' : 'border-[#C0392B]'
          }`}
        >
          <View
            className={`w-2 h-2 rounded-full ${isVeg ? 'bg-[#2D7A4F]' : 'bg-[#C0392B]'}`}
          />
        </View>
        {weight != null && (
          <Text className="text-[10px] text-[#9BB5A4]">{weight}g</Text>
        )}
      </View>

      {/* Product image */}
      {!imgError ? (
        <Image
          source={{ uri: product.imageUrl }}
          className="w-full h-20 rounded-xl mb-3"
          resizeMode="contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <View className="w-full h-20 rounded-xl mb-3 bg-[#E8F2EC] items-center justify-center">
          <Text className="text-3xl">🛒</Text>
        </View>
      )}

      {/* Name */}
      <Text className="text-sm font-semibold text-[#1A2E22] mb-0.5" numberOfLines={2}>
        {capitalize(product.name)}
      </Text>
      {/* Brand */}
      <Text className="text-xs text-[#9BB5A4] mb-3">{capitalize(product.brand)}</Text>

      {/* Add button */}
      <TouchableOpacity className="bg-[#2D7A4F] rounded-lg h-8 items-center justify-center">
        <Text className="text-white text-xs font-bold">+ Add</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SessionHomeScreen({ route, navigation }: Props) {
  const { storeId, sessionToken } = route.params;
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { accept: '*/*', Authorization: `Bearer ${sessionToken}` };

        const [storeRes, catRes, prodRes] = await Promise.all([
          fetch(`${ENV.API_BASE_URL}/api/stores/${storeId}`, { headers }),
          fetch(`${ENV.API_BASE_URL}/api/categories?storeId=${storeId}&page=1&size=20`, { headers }),
          fetch(`${ENV.API_BASE_URL}/api/products?storeId=${storeId}&page=1&size=50`, { headers }),
        ]);

        if (!storeRes.ok) throw new Error(`Failed to load store (${storeRes.status})`);

        const storeData = await storeRes.json();
        setStore(storeData.response);

        if (catRes.ok) {
          const catData = await catRes.json();
          const list: Category[] = catData?.response?.content ?? [];
          setCategories(list);
          if (list.length > 0) setSelectedCategory(list[0].categoryId);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData?.response?.content ?? []);
        }
      } catch (err: any) {
        setError(err?.message ?? 'Could not load store details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId, sessionToken]);

  const handleLogout = async () => {
    await sessionStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FBF9] items-center justify-center">
        <ActivityIndicator size="large" color="#2D7A4F" />
        <Text className="mt-4 text-sm text-[#5A7566]">Loading store…</Text>
      </SafeAreaView>
    );
  }

  if (error || !store) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FBF9] items-center justify-center px-8">
        <Text className="text-4xl mb-4">❌</Text>
        <Text className="text-lg font-bold text-[#1A2E22] text-center mb-2">Could not load store</Text>
        <Text className="text-sm text-[#5A7566] text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  const sortedHours = DAY_ORDER.filter((d) => store.openingHours[d]);
  const visibleProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBF9]">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Top bar ── */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <Text className="text-xl font-extrabold text-[#1A2E22]">GrocSpot</Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="w-10 h-10 rounded-full bg-white border border-[#D4E6DC] items-center justify-center"
          >
            <Text className="text-lg">🚪</Text>
          </TouchableOpacity>
        </View>

        {/* ── Store hero card ── */}
        <View className="mx-5 mt-3 rounded-2xl bg-[#2D7A4F] p-6">
          <View className="flex-row items-center justify-between mb-1">
            {store.isActive && (
              <View className="bg-[#9FD4B2] rounded-full px-3 py-0.5">
                <Text className="text-[10px] font-bold text-[#1A2E22]">OPEN</Text>
              </View>
            )}
          </View>
          <Text className="text-2xl font-extrabold text-white mt-1 mb-3">{store.name}</Text>
          <View className="flex-row items-start gap-2">
            <Text className="text-base mt-0.5">📍</Text>
            <Text className="text-sm text-[#C8E6D4] flex-1 leading-5">{store.address}</Text>
          </View>
        </View>

        {/* ── Search bar ── */}
        <TouchableOpacity
          className="mx-5 mt-4 h-12 bg-white rounded-xl border border-[#D4E6DC] flex-row items-center px-4 gap-2"
          onPress={() => navigation.navigate('Search', { sessionToken, categories })}
          activeOpacity={0.7}
        >
          <Text className="text-base">🔍</Text>
          <Text className="text-sm text-[#9BB5A4]">Search for products…</Text>
        </TouchableOpacity>

        {/* ── Categories ── */}
        {categories.length > 0 && (
          <View className="mt-5">
            <Text className="text-base font-bold text-[#1A2E22] px-5 mb-3">Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat.categoryId;
                return (
                  <TouchableOpacity
                    key={cat.categoryId}
                    onPress={() => setSelectedCategory(cat.categoryId)}
                    className={`rounded-2xl px-5 py-2.5 border ${
                      active ? 'bg-[#2D7A4F] border-[#2D7A4F]' : 'bg-white border-[#D4E6DC]'
                    }`}
                  >
                    <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-[#1A2E22]'}`}>
                      {capitalize(cat.name)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ── Products ── */}
        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-[#1A2E22] mb-3">
            {selectedCategory
              ? capitalize(categories.find((c) => c.categoryId === selectedCategory)?.name ?? 'Products')
              : 'Products'}
          </Text>

          {visibleProducts.length === 0 ? (
            <View className="bg-white rounded-2xl border border-[#D4E6DC] py-10 items-center">
              <Text className="text-3xl mb-2">📦</Text>
              <Text className="text-sm text-[#9BB5A4]">No products in this category</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </View>
          )}
        </View>
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
