import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ComplainPage: undefined;
  // Add other routes if needed
};

type NavbarNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Navbar: React.FC = () => {
  const navigation = useNavigation<NavbarNavigationProp>();

  const handleDashboardPress = () => {
    navigation.navigate('ComplainPage');
  };

  return (
    <View style={styles.navbar}>
      {/* Map Icon */}
      <TouchableOpacity style={styles.navItem}>
        <Icon name="map" size={28} color="#ffffff" />
        <Text style={styles.navText}>Location</Text>
      </TouchableOpacity>

      {/* Progress Bar Icon */}
      <TouchableOpacity style={styles.navItem}>
        <Icon name="bar-chart" size={28} color="#ffffff" />
        <Text style={styles.navText}>Tracking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={handleDashboardPress}>
        <Icon name="home" size={28} color="#ffffff" />
        <Text style={styles.navText}>Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Modern blue background
    justifyContent: 'space-around', // Equal space between icons
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 0, // Rounded corners for modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Adds shadow on Android
  },
  navItem: {
    flexDirection: 'column', // Icon and text aligned vertically
    alignItems: 'center',
  },
  navText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 4, // Space between icon and text
  },
});

export default Navbar;
