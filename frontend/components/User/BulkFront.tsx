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
        <Text>Type: {item.garbageTypes}</Text>
        <Text>Time: {item.pickupTime}</Text>
        <Text>Date: {formatDate(item.pickupDate)}</Text>
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
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  selectedTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    color: '#333',
  },
  selectedTabText: {
    color: '#fff',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#e3e3e3',
    marginBottom: 8,
    borderRadius: 8,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fab: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 28,
  },
  fabText: {
    fontSize: 24,
    color: '#000',
  },
  menuDots: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 60,
  },
});

export default BulkFront;