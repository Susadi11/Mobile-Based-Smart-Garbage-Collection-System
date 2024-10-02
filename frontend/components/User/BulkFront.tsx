import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import { TransactionItem } from './Bulk';

interface BulkFrontProps {
  onAddPress: () => void;
  transactions: TransactionItem[];
  onUpdateTransaction: (transaction: TransactionItem) => void;
  onDeleteTransaction: (id: string) => void;
}

const BulkFront: React.FC<BulkFrontProps> = ({
  onAddPress,
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const filteredTransactions = transactions
    .filter((item) =>
      selectedTab === 'All' ? true : item.garbageTypes.includes(selectedTab)
    )
    .filter((item) =>
      item.scheduleType.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleDeletePress = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => onDeleteTransaction(id)
        }
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    return `${year} ${month} ${day}`;
  };

  const renderTransactionItem = ({ item }: { item: TransactionItem }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionContent}>
        <Text style={styles.transactionTitle}>{item.scheduleType}</Text>
        <Text style={styles.transactionText}>Type: {item.garbageTypes}</Text>
        <Text style={styles.transactionText}>Time: {item.pickupTime}</Text>
        <Text style={styles.transactionText}>Date: {formatDate(item.pickupDate)}</Text>
      </View>
      <Menu
        visible={menuVisible === item.id}
        onDismiss={() => setMenuVisible(null)}
        anchor={
          <TouchableOpacity onPress={() => setMenuVisible(item.id)}>
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        }
      >
        <Menu.Item onPress={() => {
          setMenuVisible(null);
          onUpdateTransaction(item);
        }} title="Update" />
        <Menu.Item onPress={() => {
          setMenuVisible(null);
          handleDeletePress(item.id);
        }} title="Delete" />
      </Menu>
    </View>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Waste Pickups</Text>
        
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity style={styles.fab} onPress={onAddPress}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {['All', 'Organic', 'Paper', 'Plastic', 'E-waste'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.selectedTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6', // Tailwind bg-gray-100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937', // Tailwind text-gray-800
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#d1d5db', // Tailwind border-gray-300
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 10,
    backgroundColor: '#ffffff', // Tailwind bg-white
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    padding: 8,
    borderRadius: 9999, // Tailwind rounded-full
    borderWidth: 1,
    borderColor: '#d1d5db', // Tailwind border-gray-300
    backgroundColor: '#ffffff', // Tailwind bg-white
  },
  selectedTab: {
    backgroundColor: '#4CAF50', // Tailwind bg-green-500
  },
  tabText: {
    color: '#4b5563', // Tailwind text-gray-600
  },
  selectedTabText: {
    color: '#ffffff', // Tailwind text-white
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#4CAF50', // Tailwind border-green-500
    backgroundColor: '#ffffff', // Tailwind bg-white
    marginBottom: 8,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1f2937', // Tailwind text-gray-800
  },
  transactionText: {
    color: '#4b5563', // Tailwind text-gray-600
    marginBottom: 2,
  },
  fab: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50', // Tailwind bg-green-500
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 24,
    color: '#ffffff', // Tailwind text-white
  },
  menuDots: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4b5563', // Tailwind text-gray-600
    marginBottom: 60,
  },
});

export default BulkFront;