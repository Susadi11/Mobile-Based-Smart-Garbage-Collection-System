import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ComplainPage: undefined;
  // Add other routes if needed
};

type NavbarNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ListNavbar: React.FC = () => {
  const navigation = useNavigation<NavbarNavigationProp>();
  const [showList, setShowList] = useState(false); // State to toggle the list

  const handleDashboardPress = () => {
    navigation.navigate('ComplainPage');
  };

  const toggleList = () => {
    setShowList(!showList); // Toggle the list visibility
  };

  return (
    <View>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Map Icon */}
        

        {/* List Icon */}
        <TouchableOpacity style={styles.navItem} onPress={toggleList}>
          <Icon name="list" size={28} color="#ffffff" />
          
        </TouchableOpacity>
      </View>

      {/* Conditional List of Box Icons */}
      {showList && (
        <View style={styles.listContainer}>
          {/* Box Icon 1 */}
          <TouchableOpacity style={styles.boxItem}>
            <Icon name="profile" size={28} color="#ffffff" />
            <Text style={styles.boxText}>Profile</Text>
          </TouchableOpacity>

          {/* Box Icon 2 */}
          <TouchableOpacity style={styles.boxItem}>
            <Icon name="map" size={28} color="#ffffff" />
            <Text style={styles.boxText}>Map</Text>
          </TouchableOpacity>

          {/* Box Icon 3 */}
          <TouchableOpacity style={styles.boxItem}>
            <Icon name="history" size={28} color="#ffffff" />
            <Text style={styles.boxText}>History</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    height:55,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft:300,
  },
  navText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 4,
  },
  listContainer: {
    backgroundColor: '#00875A',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ffffff',
  },
  boxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  boxText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ListNavbar;
