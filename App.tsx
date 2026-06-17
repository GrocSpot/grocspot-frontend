import './global.css';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Welcome to GrocSpot!</Text>
      </View>
    </ScrollView>
  );
}