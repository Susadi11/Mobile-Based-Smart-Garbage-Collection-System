import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BulkFront from '@/components/User/BulkFront';
import { getFirestore, collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

type RootStackParamList = {
  BulkPage: undefined;
  AddBulkPage: {
    transaction?: TransactionItem;
    onAddComplete: (newRecord: TransactionItem) => void;
    onUpdateComplete: (updatedRecord: TransactionItem) => void;
  };
};

type BulkPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BulkPage'>;

export interface TransactionItem {
  id: string;
  name: string;
  scheduleType: string;
  garbageTypes: string;
  pickupTime: string;
  pickupDate: string;
  location: { latitude: number; longitude: number };
  weight?: string | null;
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
      ...(doc.data() as Omit<TransactionItem, 'id'>)
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
      },
      onUpdateComplete: () => {} // This won't be used for new records
    });
  };

  const handleUpdateTransaction = (transaction: TransactionItem) => {
    navigation.navigate('AddBulkPage', {
      transaction,
      onAddComplete: () => {}, // This won't be used for updates
      onUpdateComplete: (updatedRecord: TransactionItem) => {
        setTransactions(prevTransactions =>
          prevTransactions.map(t => t.id === updatedRecord.id ? updatedRecord : t)
        );
      }
    });
  };

  const handleDeleteTransaction = async (id: string) => {
    const firestore = getFirestore(app);
    await deleteDoc(doc(firestore, 'wasteSchedules', id));
    setTransactions(prevTransactions =>
      prevTransactions.filter(transaction => transaction.id !== id)
    );
  };

  return (
    <View style={styles.container}>
      <BulkFront
        onAddPress={handleAddBulk}
        transactions={transactions}
        onUpdateTransaction={handleUpdateTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BulkPage;