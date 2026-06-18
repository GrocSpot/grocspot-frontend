import React from 'react';
import { View, Text } from 'react-native';

interface DividerProps {
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({ label }) => {
  if (!label) {
    return <View className="h-px bg-[#E8F2EC] my-4" />;
  }

  return (
    <View className="flex-row items-center my-5 gap-3">
      <View className="flex-1 h-px bg-[#E8F2EC]" />
      <Text className="text-xs text-[#9BB5A4] font-medium">{label}</Text>
      <View className="flex-1 h-px bg-[#E8F2EC]" />
    </View>
  );
};