import React, { useEffect } from 'react';
import { Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library

type TabBarButtonProps = {
  isFocused: boolean;
  label: string;
  onPress: () => void;
  onLongPress: () => void;
  routeName: string;
  color: string;
};

const TabBarButton: React.FC<TabBarButtonProps> = ({
  isFocused,
  label,
  onPress,
  onLongPress,
  routeName,
  color,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { stiffness: 200 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, -10]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    } as ViewStyle;
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity } as TextStyle;
  });

  // Render the appropriate icon based on the routeName
  const renderIcon = (routeName: string) => {
    switch (routeName) {
      case 'HomePage':
      case 'HomeDash':
        return <MaterialCommunityIcons name="home" color={color} size={26} />;
      case 'BulkPage':
        return <MaterialCommunityIcons name="warehouse" color={color} size={26} />;
      case 'ComplainPage':
      case 'ComplainDash':
        return <MaterialCommunityIcons name="alert-circle" color={color} size={26} />;
      case 'StorePage':
      case 'StoreDash':
        return <MaterialCommunityIcons name="store" color={color} size={26} />;
      case 'Map':
        return <MaterialCommunityIcons name="map" color={color} size={26} />;
      default:
        return null;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}
    >
      <Animated.View style={animatedIconStyle}>
        {renderIcon(routeName)}
      </Animated.View>
      <Animated.Text style={[styles.label, { color }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
  },
});

export default TabBarButton;
