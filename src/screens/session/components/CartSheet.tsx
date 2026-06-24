import { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import type { CartItem } from '../../../hooks/useSessionHome';
import type { Product } from '../../../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  onClearCart: () => void;
}

export function CartSheet({
  visible,
  onClose,
  cartItems,
  isRefreshing,
  onRefresh,
  onAdd,
  onRemove,
  onClearCart,
}: Props) {
  useEffect(() => {
    if (visible) onRefresh();
  }, [visible]);

  const total = cartItems.reduce((sum, i) => {
    const price = i.product.sellingPrice ?? i.product.mrp ?? 0;
    return sum + price * i.qty;
  }, 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: '85%' }}>
          <SafeAreaView>
            {/* Handle bar */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
              <Text className="text-lg font-bold text-[#1F2937]">Your Cart</Text>
              <View className="flex-row items-center gap-3">
                {cartItems.length > 0 && (
                  <TouchableOpacity onPress={onClearCart} activeOpacity={0.7}>
                    <Text className="text-sm font-semibold text-[#EF4444]">Clear Cart</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={onClose}
                  className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-[#6B7280] text-base font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isRefreshing ? (
              <View className="py-16 items-center">
                <ActivityIndicator color="#166534" />
              </View>
            ) : cartItems.length === 0 ? (
              <View className="py-16 items-center px-8">
                <Text className="text-4xl mb-3">🛒</Text>
                <Text className="text-sm font-bold text-[#1F2937] text-center mb-1">
                  Your cart is empty
                </Text>
                <Text className="text-xs text-[#6B7280] text-center">
                  Add products to get started
                </Text>
              </View>
            ) : (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}
                >
                  {cartItems.map((item) => {
                    const price = item.product.sellingPrice ?? item.product.mrp;
                    return (
                      <View
                        key={item.product.productId}
                        className="flex-row items-center bg-[#F9FAFB] rounded-2xl px-3 py-3 border border-[#F3F4F6]"
                      >
                        <View className="flex-1 mr-3">
                          <Text className="text-sm font-semibold text-[#1F2937]" numberOfLines={1}>
                            {item.product.name}
                          </Text>
                          <Text className="text-xs text-[#6B7280] mt-0.5" numberOfLines={1}>
                            {item.product.brand}
                          </Text>
                          {price != null && (
                            <Text className="text-xs font-bold text-[#166534] mt-1">
                              ₹{(price * item.qty).toFixed(2)}
                            </Text>
                          )}
                        </View>

                        {/* Quantity controls */}
                        <View className="flex-row items-center bg-white rounded-xl border border-[#BBF7D0] overflow-hidden">
                          <TouchableOpacity
                            onPress={() => onRemove(item.product.productId)}
                            className="w-9 h-9 items-center justify-center"
                            activeOpacity={0.7}
                          >
                            <Text className="text-[#166534] text-lg font-bold">−</Text>
                          </TouchableOpacity>
                          <Text className="w-8 text-center text-sm font-bold text-[#1F2937]">
                            {item.qty}
                          </Text>
                          <TouchableOpacity
                            onPress={() => onAdd(item.product)}
                            className="w-9 h-9 items-center justify-center"
                            activeOpacity={0.7}
                          >
                            <Text className="text-[#166534] text-lg font-bold">+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                {/* Footer total + checkout */}
                <View className="px-4 pt-3 pb-5 border-t border-[#F3F4F6]">
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-sm text-[#6B7280]">
                      {cartItems.reduce((s, i) => s + i.qty, 0)} item
                      {cartItems.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''}
                    </Text>
                    {total > 0 && (
                      <Text className="text-sm font-bold text-[#1F2937]">
                        ₹{total.toFixed(2)}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    className="bg-[#166534] rounded-2xl py-4 items-center"
                    activeOpacity={0.85}
                  >
                    <Text className="text-white font-bold text-base">Proceed to Checkout</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
