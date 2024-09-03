import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BulkFront from '@/components/User/BulkFront';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Adjust the import path as needed

type RootStackParamList = {
  BulkPage: undefined;
  AddBulkPage: { onAddComplete: (newRecord: TransactionItem) => void };
};

type BulkPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BulkPage'>;

export interface TransactionItem {
  id: string;
  scheduleType: string;
  garbageTypes: string;
  pickupTime: string;
  pickupDate: string;
}

const BulkPage: React.FC = () => {
  const navigation = useNavigation<BulkPageNavigationProp>();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  const fetchTransactions = async () => {
    const firestore = getFirestore(app);
    const wasteSchedulesCollection = collection(firestore, 'wasteSchedules');
    const q = query(wasteSchedulesCollection, orderBy('pickupDate', 'desc'));
    const querySnapshot = await getDocs(q);
    const fetchedTransactions: TransactionItem[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<TransactionItem, 'id'>
    }));
    setTransactions(fetchedTransactions);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const handleAddBulk = () => {
    navigation.navigate('AddBulkPage', {
      onAddComplete: (newRecord: TransactionItem) => {
        setTransactions(prevTransactions => [newRecord, ...prevTransactions]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <BulkFront onAddPress={handleAddBulk} transactions={transactions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BulkPage;