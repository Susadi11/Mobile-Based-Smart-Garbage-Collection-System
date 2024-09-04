import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur'; // Using BlurView for a glassy effect
import TabBarButton from './TabBarButton';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const primaryColor = '#3d9c56'; // Your preferred bottom bar color
  const greyColor = '#737373'; 

  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="light" style={styles.tabbar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              label={label as string}
              routeName={route.name}
              color={isFocused ? primaryColor : greyColor}
            />
          );
        })}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    borderRadius: 45,
    overflow: 'hidden',
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparency to show blur
    borderRadius: 45,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});

export default TabBar;
