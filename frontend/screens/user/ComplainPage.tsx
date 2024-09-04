import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Form from '@/components/vindi/Form'; // Adjust the import path according to your project structure

const ComplainDash: React.FC = () => {
  return (
    <View style={styles.container}>
      <Form />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
  },
});

export default ComplainDash;
