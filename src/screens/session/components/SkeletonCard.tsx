import { View } from 'react-native';

export function SkeletonCard({ cardWidth }: { cardWidth?: number }) {
  return (
    <View
      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-3"
      style={{ width: cardWidth ?? '48%' }}
    >
      <View className="h-32 bg-[#F0FDF4]" />
      <View className="p-3 gap-2">
        <View className="h-2 w-12 rounded-full bg-[#E5E7EB]" />
        <View className="h-3 w-20 rounded-full bg-[#F0FDF4]" />
        <View className="h-2 w-10 rounded-full bg-[#F0FDF4]" />
        <View className="mt-2 h-8 rounded-xl bg-[#F0FDF4]" />
      </View>
    </View>
  );
}
