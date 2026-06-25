import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../types';
import { tokenStorage } from '../../storage/tokenStorage';
import { CanvasGrid } from '../../components/layout/components/CanvasGrid';
import { useLayoutStore } from '../../store/useLayoutStore';
import { useLayout } from '../../hooks/useLayout';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LayoutEditor'>;
  route: RouteProp<RootStackParamList, 'LayoutEditor'>;
};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export default function LayoutEditorScreen({ navigation, route }: Props) {
  // storeId and accessToken come from navigation params set at login
  const { storeId, accessToken } = route.params;

  const { isLoading, isDirty, error, saveLayout } = useLayout(storeId, accessToken);
  const { items } = useLayoutStore();
  const isEmpty = items.length === 0;

  const handleLogout = async () => {
    await tokenStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleSave = () => {
    Alert.alert('Save layout', 'Save the current layout to the store?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: saveLayout },
    ]);
  };

  // ── Loading (first fetch) ─────────────────────────────────────────────
  if (isLoading && isEmpty) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#1D9E75" />
        <Text style={{ marginTop: 12, color: '#1D9E75', fontSize: 14 }}>
          Loading store layout…
        </Text>
      </SafeAreaView>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#E24B4A', fontSize: 14, textAlign: 'center' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  // ── Editor ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F6' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#111' }}>
            Store layout
          </Text>
          <Text style={{ fontSize: 11, color: '#888', marginTop: 1 }}>
            Manager editor
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* Save button — greyed out until there are unsaved changes */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isDirty || isLoading}
            style={{
              backgroundColor: isDirty ? '#1D9E75' : '#B4B2A9',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>
              {isLoading ? 'Saving…' : 'Save'}
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: 'rgba(0,0,0,0.15)',
            }}
          >
            <Text style={{ fontSize: 14, color: '#555' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable canvas */}
      <ScrollView
        horizontal
        style={{ flex: 1 }}
        contentContainerStyle={{ width: CANVAS_WIDTH }}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ height: CANVAS_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          <CanvasGrid
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            isEmpty={isEmpty}
          />
        </ScrollView>
      </ScrollView>

      {/* Fixture toolbox placeholder */}
      <View style={{
        height: 80,
        backgroundColor: '#fff',
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{ color: '#B4B2A9', fontSize: 13 }}>
          Fixture toolbox — coming next
        </Text>
      </View>

    </SafeAreaView>
  );
}