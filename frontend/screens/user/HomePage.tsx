import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeUs from '@/components/User/HomeUs';

const HomePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <HomeUs />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});

export default HomePage;
