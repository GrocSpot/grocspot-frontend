import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-[#1A2E22] mb-1.5">{label}</Text>
      <View
        className={`flex-row items-center bg-white rounded-xl px-4 h-14 border ${
          error
            ? 'border-[#D94F3D]'
            : isFocused
            ? 'border-[#2D7A4F]'
            : 'border-[#D4E6DC]'
        }`}
      >
        <TextInput
          className="flex-1 text-base text-[#1A2E22]"
          placeholderTextColor="#9BB5A4"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} className="ml-2 p-1">
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text className="text-xs text-[#D94F3D] mt-1">{error}</Text>
      ) : null}
    </View>
  );
};