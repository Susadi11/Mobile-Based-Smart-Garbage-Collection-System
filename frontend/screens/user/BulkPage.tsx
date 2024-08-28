import BulkFront from '@/components/User/BulkFront';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the RootStackParamList to include all your screen names
type RootStackParamList = {
  BulkPage: undefined;
  AddBulkPage: undefined;
  // Add other screen names here
};

// Define the navigation prop type
type BulkPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BulkPage'>;

const BulkPage: React.FC = () => {
  const navigation = useNavigation<BulkPageNavigationProp>();

  const handleAddBulk = () => {
    navigation.navigate('AddBulkPage');
  };

  return (
    <View style={styles.container}>
      <BulkFront onAddPress={handleAddBulk} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BulkPage;