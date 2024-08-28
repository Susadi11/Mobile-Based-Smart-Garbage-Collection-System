import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface BulkFrontProps {
  onAddPress: () => void;
}

const BulkFront: React.FC<BulkFrontProps> = ({ onAddPress }) => {
  const [sortOption, setSortOption] = useState('Newest First');
  const [selectedTab, setSelectedTab] = useState('All');

  const transactions = [
    {
      id: '1',
      scheduleType: 'Bulk Waste',
      garbageTypes: 'Organic',
      pickupTime: '12.56',
      pickupDate: '21/7/2024',
    },
    {
        id: '2',
        scheduleType: 'Normal Scedule',
        garbageTypes: 'Plastic',
        pickupTime: '12.56',
        pickupDate: '23/7/2024',
    },
    {
        id: '3',
        scheduleType: 'Bulk Waste',
        garbageTypes: 'Paper',
        pickupTime: '12.56',
        pickupDate: '21/7/2024',
    },
    {
        id: '4',
        scheduleType: 'Bulk Waste',
        garbageTypes: 'E-waste',
        pickupTime: '12.56',
        pickupDate: '21/7/2024',
    },
  ];

  const filteredTransactions = transactions.filter((item) =>
    selectedTab === 'All' ? true : item.garbageTypes === selectedTab
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste Pickups</Text>

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={sortOption}
          style={styles.picker}
          onValueChange={(itemValue: string) => setSortOption(itemValue)}
        >
          <Picker.Item label="Newest First" value="Newest First" />
          <Picker.Item label="Oldest First" value="Oldest First" />
        </Picker>

     
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

      <TouchableOpacity style={styles.fab} onPress={onAddPress}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F6F2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
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
    backgroundColor: '#B59F59',
  },
  tabText: {
    color: '#333',
  },
  selectedTabText: {
    color: '#fff',
  },
  transactionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#B59F59',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
  },
});

export default BulkFront;