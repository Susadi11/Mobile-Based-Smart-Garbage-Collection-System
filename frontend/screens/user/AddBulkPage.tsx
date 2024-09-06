import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Bulk, { TransactionItem } from '@/components/User/Bulk';

type RootStackParamList = {
  AddBulkPage: {
    transaction?: TransactionItem;
    onAddComplete: (newRecord: TransactionItem) => void;
    onUpdateComplete: (updatedRecord: TransactionItem) => void;
  };
};

type AddBulkPageRouteProp = RouteProp<RootStackParamList, 'AddBulkPage'>;

const AddBulkPage: React.FC = () => {
  const route = useRoute<AddBulkPageRouteProp>();
  const { transaction, onAddComplete, onUpdateComplete } = route.params;

  return (
    <View style={styles.container}>
      <Bulk
        existingTransaction={transaction}
        onAddComplete={onAddComplete}
        onUpdateComplete={onUpdateComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddBulkPage;