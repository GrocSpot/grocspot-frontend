import { View, Text } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';

interface CanvasGridProps {
  width: number;
  height: number;
  isEmpty: boolean;
}

const GRID_SIZE = 20; // matches the 20px snap grid from the roadmap

export function CanvasGrid({ width, height, isEmpty }: CanvasGridProps) {
  return (
    <View style={{ width, height }}>
      {/* SVG dot-grid background */}
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        <Defs>
          {/* One dot every 20px — the snap grid unit */}
          <Pattern
            id="grid"
            x="0"
            y="0"
            width={GRID_SIZE}
            height={GRID_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1" cy="1" r="1" fill="#1D9E75" opacity={0.25} />
          </Pattern>
        </Defs>
        <Rect width={width} height={height} fill="url(#grid)" />
      </Svg>

      {/* Empty state hint — only visible when no fixtures exist */}
      {isEmpty && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: '#1D9E75',
              opacity: 0.5,
              fontSize: 14,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            Your store floor is empty{'\n'}
            Drag fixtures from the toolbar below
          </Text>
        </View>
      )}
    </View>
  );
}