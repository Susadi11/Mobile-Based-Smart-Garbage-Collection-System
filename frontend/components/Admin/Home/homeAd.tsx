import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const HomeAd = () => {
  return (
    <>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.balanceLabel}>Available Balance in</Text>
        <TextInput style={styles.searchBar} placeholder="Search here" />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#7F58FE' }]}>
          <Text style={styles.actionText}>Account Statement</Text>
          <Text style={styles.subText}>Acc to Acc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FC9272' }]}>
          <Text style={styles.actionText}>Fund Transfer</Text>
          <Text style={styles.subText}>Acc to Acc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF8B8B' }]}>
          <Text style={styles.actionText}>Pay Bills</Text>
          <Text style={styles.subText}>Acc to Biller</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF8B8B' }]}>
          <Text style={styles.actionText}>Pay Bills</Text>
          <Text style={styles.subText}>Acc to Biller</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <View style={styles.transactionList}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Schedules</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {/* Transaction Items */}
        <View style={styles.transactionItem}>
          <View>
            <Text style={styles.transactionName}>Restaurant</Text>
            <Text style={styles.transactionLocation}>The Curtain, London</Text>
          </View>
          <Text style={styles.transactionAmount}>$35.00</Text>
        </View>

        
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#888',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionsContainer: {
    flexDirection: 'row',
   
  },
  actionButton: {
    flex: 1,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 10,
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  transactionList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 16,
    color: '#FC9272',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionLocation: {
    fontSize: 14,
    color: '#888',
  },
  transactionAmount: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FC9272',
  },
});

export default HomeAd;
