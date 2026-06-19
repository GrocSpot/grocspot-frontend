import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, Category, SearchProduct } from '../../types';
import { ENV } from '../../config/env';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Search'>;
  route: RouteProp<RootStackParamList, 'Search'>;
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function SearchProductCard({ product }: { product: SearchProduct }) {
  const [imgError, setImgError] = useState(false);

  return (
    <View className="bg-white rounded-2xl border border-[#D4E6DC] p-4" style={{ width: '47%' }}>
      {imgError ? (
        <View className="w-full h-20 rounded-xl mb-3 bg-[#E8F2EC] items-center justify-center">
          <Text className="text-3xl">🛒</Text>
        </View>
      ) : (
        <Image
          source={{ uri: product.imageUrl }}
          className="w-full h-20 rounded-xl mb-3"
          resizeMode="contain"
          onError={() => setImgError(true)}
        />
      )}
      <Text className="text-sm font-semibold text-[#1A2E22] mb-0.5" numberOfLines={2}>
        {capitalize(product.name)}
      </Text>
      <Text className="text-xs text-[#9BB5A4] mb-3">{capitalize(product.brand)}</Text>
      <View className="bg-[#E8F2EC] self-start rounded-full px-2 py-0.5 mb-3">
        <Text className="text-[10px] font-semibold text-[#2D7A4F]">{capitalize(product.categoryName)}</Text>
      </View>
      <TouchableOpacity className="bg-[#2D7A4F] rounded-lg h-8 items-center justify-center">
        <Text className="text-white text-xs font-bold">+ Add</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SearchScreen({ route, navigation }: Props) {
  const { sessionToken, categories } = route.params;
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${ENV.API_BASE_URL}/api/products/search?query=${encodeURIComponent(trimmed)}&page=1&size=10`,
          { headers: { accept: '*/*', Authorization: `Bearer ${sessionToken}` } },
        );
        const data = await res.json();
        setResults(data?.response?.content ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleCategoryPress = (cat: Category) => {
    setSelectedCategory(cat.categoryId);
    setQuery(cat.name);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBF9]">

      {/* ── Header ── */}
      <View className="flex-row items-center px-5 pt-4 pb-3 gap-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white border border-[#D4E6DC] items-center justify-center"
        >
          <Text className="text-base">←</Text>
        </TouchableOpacity>

        <View className="flex-1 h-11 bg-white rounded-xl border border-[#D4E6DC] flex-row items-center px-3 gap-2">
          <Text className="text-base">🔍</Text>
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={(t) => { setQuery(t); setSelectedCategory(null); }}
            placeholder="Search for products…"
            placeholderTextColor="#9BB5A4"
            className="flex-1 text-sm text-[#1A2E22]"
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setSelectedCategory(null); }}>
              <Text className="text-[#9BB5A4] text-base">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Categories ── */}
        {categories.length > 0 && (
          <View className="mb-4">
            <Text className="text-base font-bold text-[#1A2E22] px-5 mb-3">Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat.categoryId;
                return (
                  <TouchableOpacity
                    key={cat.categoryId}
                    onPress={() => handleCategoryPress(cat)}
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

        {/* ── Results ── */}
        <View className="px-5">
          {loading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color="#2D7A4F" />
            </View>
          ) : query.trim() === '' ? (
            <View className="items-center py-16">
              <Text className="text-4xl mb-3">🔍</Text>
              <Text className="text-sm text-[#9BB5A4] text-center">
                Search by product name or tap a category above
              </Text>
            </View>
          ) : searched && results.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-4xl mb-3">📦</Text>
              <Text className="text-sm text-[#9BB5A4] text-center">
                No products found for "{query}"
              </Text>
            </View>
          ) : (
            <>
              {results.length > 0 && (
                <Text className="text-xs text-[#9BB5A4] mb-3">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </Text>
              )}
              <View className="flex-row flex-wrap gap-3 pb-8">
                {results.map((product) => (
                  <SearchProductCard key={product.productId} product={product} />
                ))}
              </View>
            </>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
