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
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import Ionicons from 'react-native-vector-icons/Ionicons';


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

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

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
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={24} color="#4b5563" style={styles.searchIcon} />
             <TextInput
      style={styles.searchBar}
      placeholder="Search..."
      value={searchQuery}
      onChangeText={(text) => setSearchQuery(text)}
    />
  </View>
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
    marginBottom: 16,
    color: '#1f2937', // Tailwind text-gray-800
    fontFamily: 'Inter_700Bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f3f4f6', 
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
    borderColor: '#d1d5db', // Tailwind border-gray-300
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#4b5563', 
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
    fontFamily: 'Inter_600SemiBold',
  },
  selectedTabText: {
    color: '#ffffff', // Tailwind text-white
    fontFamily: 'Inter_600SemiBold',
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
    marginBottom: 4,
    color: '#1f2937', // Tailwind text-gray-800
    fontFamily: 'Inter_600SemiBold',
  },
  transactionText: {
    color: '#4b5563', // Tailwind text-gray-600
    marginBottom: 2,
    fontFamily: 'Inter_500Medium',
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
    fontFamily: 'Inter_600SemiBold',
  },
  menuDots: {
    fontSize: 24,
    color: '#4b5563', // Tailwind text-gray-600
    marginBottom: 60,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default BulkFront;