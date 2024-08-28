import Bulk from '@/components/User/Bulk';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';


const AddBulkPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Bulk/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddBulkPage;
