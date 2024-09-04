import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { TransactionItem } from './Bulk';

interface BulkFrontProps {
  onAddPress: () => void;
  transactions: TransactionItem[];
}

const BulkFront: React.FC<BulkFrontProps> = ({ onAddPress, transactions }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions
    .filter((item) =>
      selectedTab === 'All' ? true : item.garbageTypes.includes(selectedTab)
    )
    .filter((item) =>
      item.scheduleType.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
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
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionTitle}>{item.scheduleType}</Text>
            <Text>Type: {item.garbageTypes}</Text>
            <Text>Time: {item.pickupTime}</Text>
            <Text>Date: {item.pickupDate}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF', // White background
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
    backgroundColor: '#4CAF50', // Green shade
  },
  tabText: {
    color: '#333',
  },
  selectedTabText: {
    color: '#fff',
  },
  transactionItem: {
    padding: 16,
    borderWidth: 1, // Outline border
    borderColor: '#4CAF50', // Light gray border color
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
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
    color: '#000', // Black color
  },
});

export default BulkFront;
