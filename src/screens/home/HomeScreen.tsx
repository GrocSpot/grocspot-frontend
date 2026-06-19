// ─────────────────────────────────────────────
//  src/screens/home/HomeScreen.tsx
//
//  Shown after successful login.
//  Reads the token from SecureStore to confirm
//  the user is authenticated.
//  Logout clears the token and goes back to Login.
// ─────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { tokenStorage } from '../../storage/tokenStorage';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// ── Static data ───────────────────────────────

const CATEGORIES = [
  { id: '1', label: 'Fruits', emoji: '🍎' },
  { id: '2', label: 'Vegetables', emoji: '🥦' },
  { id: '3', label: 'Dairy', emoji: '🥛' },
  { id: '4', label: 'Bakery', emoji: '🍞' },
  { id: '5', label: 'Meat', emoji: '🥩' },
  { id: '6', label: 'Drinks', emoji: '🧃' },
];

const FEATURED = [
  { id: '1', name: 'Fresh Apples', price: '₹120', unit: 'per kg', emoji: '🍎', tag: 'Organic' },
  { id: '2', name: 'Whole Milk', price: '₹60', unit: 'per litre', emoji: '🥛', tag: 'Fresh' },
  { id: '3', name: 'Sourdough Bread', price: '₹90', unit: 'per loaf', emoji: '🍞', tag: 'Bakery' },
  { id: '4', name: 'Broccoli', price: '₹45', unit: 'per piece', emoji: '🥦', tag: 'Local' },
];

// ── Screen ────────────────────────────────────

export default function HomeScreen({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('1');

  const handleLogout = async () => {
    await tokenStorage.clear();
    // Reset the stack so user can't go back to Home with hardware back button
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBF9]">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Top bar ── */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <View>
            <Text className="text-xs text-[#5A7566]">Good morning 👋</Text>
            <Text className="text-xl font-extrabold text-[#1A2E22]">GrocSpot</Text>
          </View>
          <View className="flex-row items-center gap-3">
            {/* Cart */}
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white border border-[#D4E6DC] items-center justify-center">
              <Text className="text-lg">🛒</Text>
            </TouchableOpacity>
            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              className="w-10 h-10 rounded-full bg-white border border-[#D4E6DC] items-center justify-center"
            >
              <Text className="text-lg">🚪</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search bar ── */}
        <TouchableOpacity className="mx-5 mt-3 mb-5 h-12 bg-white rounded-xl border border-[#D4E6DC] flex-row items-center px-4 gap-2">
          <Text className="text-base">🔍</Text>
          <Text className="text-sm text-[#9BB5A4]">Search for groceries…</Text>
        </TouchableOpacity>

        {/* ── Banner ── */}
        <View className="mx-5 mb-6 rounded-2xl bg-[#2D7A4F] p-5 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xs text-[#9FD4B2] font-medium mb-1">LIMITED TIME</Text>
            <Text className="text-lg font-extrabold text-white leading-tight">
              20% off on{'\n'}fresh produce
            </Text>
            <TouchableOpacity className="mt-3 bg-white rounded-lg px-4 py-2 self-start">
              <Text className="text-xs font-bold text-[#2D7A4F]">Shop now</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-6xl ml-2">🥬</Text>
        </View>

        {/* ── Categories ── */}
        <View className="mb-5">
          <View className="flex-row items-center justify-between px-5 mb-3">
            <Text className="text-base font-bold text-[#1A2E22]">Categories</Text>
            <TouchableOpacity>
              <Text className="text-xs font-medium text-[#2D7A4F]">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className={`items-center justify-center rounded-2xl px-4 py-3 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#2D7A4F] border-[#2D7A4F]'
                    : 'bg-white border-[#D4E6DC]'
                }`}
              >
                <Text className="text-2xl mb-1">{cat.emoji}</Text>
                <Text className={`text-xs font-semibold ${selectedCategory === cat.id ? 'text-white' : 'text-[#1A2E22]'}`}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Featured products ── */}
        <View className="px-5 mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-[#1A2E22]">Featured</Text>
            <TouchableOpacity>
              <Text className="text-xs font-medium text-[#2D7A4F]">See all</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {FEATURED.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-white rounded-2xl border border-[#D4E6DC] p-4"
                style={{ width: '47%' }}
              >
                {/* Tag */}
                <View className="bg-[#E8F2EC] self-start rounded-full px-2 py-0.5 mb-3">
                  <Text className="text-[10px] font-semibold text-[#2D7A4F]">{item.tag}</Text>
                </View>
                {/* Emoji */}
                <Text className="text-4xl mb-2">{item.emoji}</Text>
                {/* Name */}
                <Text className="text-sm font-semibold text-[#1A2E22] mb-1" numberOfLines={1}>
                  {item.name}
                </Text>
                {/* Price */}
                <Text className="text-base font-extrabold text-[#2D7A4F]">{item.price}</Text>
                <Text className="text-[10px] text-[#9BB5A4]">{item.unit}</Text>
                {/* Add button */}
                <TouchableOpacity className="mt-3 bg-[#2D7A4F] rounded-lg h-8 items-center justify-center">
                  <Text className="text-white text-xs font-bold">+ Add</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}