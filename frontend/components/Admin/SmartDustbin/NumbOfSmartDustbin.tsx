import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Using Ionicons for checkmark

// Define types for the dustbin data
interface Dustbin {
  id: string;
  binNumber: string;
  user: string;
  status: string;
  isCollected: boolean;
}

const NumbOfSmartDustbin: React.FC = () => {
  const [dustbinData, setDustbinData] = useState<Dustbin[]>([
    { id: '1', binNumber: 'Dustbin1', user: 'John Doe', status: 'Full', isCollected: false },
    { id: '2', binNumber: 'Dustbin2', user: 'Jane Smith', status: 'Not Full', isCollected: false },
    { id: '3', binNumber: 'Dustbin3', user: 'Alice Johnson', status: 'Full', isCollected: false },
    { id: '4', binNumber: 'Dustbin4', user: 'Bob Lee', status: 'Not Full', isCollected: false },
  ]);

  // Toggle collection status and set status to "Full" if checkbox is checked
  const toggleCollected = (id: string) => {
    setDustbinData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, isCollected: !item.isCollected, status: item.isCollected ? 'Full' : 'Not Full' } // Mark as "Not Full" after collection
          : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Number of Smart Dustbins</Text>

      {dustbinData.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.cell}>{item.binNumber}</Text>
          <Text style={styles.cell}>{item.user}</Text>
          <Text
            style={[styles.cell, item.status === 'Full' ? styles.fullStatus : styles.notFullStatus]}
          >
            {item.status}
          </Text>

          {/* Show checkbox only when the bin is full and hide after collection */}
          {item.status === 'Full' && !item.isCollected && (
            <TouchableOpacity
              style={styles.customCheckbox}
              onPress={() => toggleCollected(item.id)}
            >
              <Ionicons name="checkmark" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cell: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  fullStatus: {
    color: '#d32f2f', // Red for Full status
  },
  notFullStatus: {
    color: '#388e3c', // Green for Not Full status
  },
  customCheckbox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NumbOfSmartDustbin;
