import { View, Text, TouchableOpacity, Image } from 'react-native';
import type { Product } from '../../../types';

interface ProductCardProps {
  product: Product;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const BG_COLORS = ['#FFF7ED', '#F0FDF4', '#FFF1F2', '#F0F9FF', '#FEFCE8', '#FAF5FF'];

export function ProductCard({ product, qty, onAdd, onRemove }: ProductCardProps) {
  const colorIndex = product.categoryId
    ? product.categoryId.charCodeAt(product.categoryId.length - 1) % BG_COLORS.length
    : 0;
  const cardBg = BG_COLORS[colorIndex];

  return (
    <View
      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-3"
      style={{ width: '48%' }}
    >
      <View className="h-32 items-center justify-center" style={{ backgroundColor: cardBg }}>
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

      <View className="p-3">
        <Text
          className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide mb-0.5"
          numberOfLines={1}
        >
          {product.brand}
        </Text>
        <Text
          className="text-xs font-bold text-[#1F2937] leading-tight mb-1"
          numberOfLines={2}
        >
          {cap(product.name)}
        </Text>

        {product.metadata?.weightGrams ? (
          <Text className="text-[10px] text-[#9CA3AF]">
            {product.metadata.weightGrams} g
          </Text>
        ) : null}

        {product.sellingPrice != null && product.mrp != null && product.sellingPrice < product.mrp ? (
          <View className="flex-row items-center gap-1.5 mt-1 mb-2">
            <Text className="text-[10px] text-[#9CA3AF] line-through">
              ₹{product.mrp}
            </Text>
            <Text className="text-xs font-bold text-[#166534]">
              ₹{product.sellingPrice}
            </Text>
          </View>
        ) : product.sellingPrice != null ? (
          <Text className="text-xs font-bold text-[#1F2937] mt-1 mb-2">
            ₹{product.sellingPrice}
          </Text>
        ) : (
          <View className="mb-2" />
        )}

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
