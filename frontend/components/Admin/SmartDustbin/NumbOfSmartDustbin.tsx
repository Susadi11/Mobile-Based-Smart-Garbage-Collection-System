import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NumbOfSmartDustbin: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Number of Smart Dustbins</Text>
      {/* Add any other content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default NumbOfSmartDustbin;
