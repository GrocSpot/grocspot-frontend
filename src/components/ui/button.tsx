import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const containerClass = {
    primary: `bg-[#2D7A4F] ${isDisabled ? 'opacity-60' : 'active:bg-[#1E5C39]'}`,
    outline: `border border-[#2D7A4F] bg-transparent ${isDisabled ? 'opacity-60' : 'active:bg-[#E8F2EC]'}`,
    ghost: `bg-transparent ${isDisabled ? 'opacity-60' : 'active:bg-[#E8F2EC]'}`,
  }[variant];

  const textClass = {
    primary: 'text-white font-semibold text-base',
    outline: 'text-[#2D7A4F] font-semibold text-base',
    ghost: 'text-[#2D7A4F] font-semibold text-base',
  }[variant];

  return (
    <TouchableOpacity
      className={`${containerClass} ${fullWidth ? 'w-full' : ''} h-14 rounded-xl flex-row items-center justify-center`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator
            color={variant === 'primary' ? '#fff' : '#2D7A4F'}
            size="small"
          />
          <Text className={`${textClass} ml-2`}>Please wait…</Text>
        </View>
      ) : (
        <Text className={textClass}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};