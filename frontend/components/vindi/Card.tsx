import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CardComponent = () => {
  return (
    <ScrollView horizontal={true} style={styles.scrollContainer}>
      <View style={styles.card}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>1</Text>
        </View>
        
        <Text style={styles.cardTitle}>Make Complaint</Text>
        <Text style={styles.cardDescription}>Submit your complaint to initiate the process.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
       
        <Text style={styles.cardTitle}>Confirm Complaint</Text>
        <Text style={styles.cardDescription}>Ensure that your complaint is recorded.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
        <Text style={styles.cardTitle}>View Status</Text>
        <Text style={styles.cardDescription}>Check the progress of your complaint.</Text>
      </View>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 5,
  },
  card: {
    marginTop:20,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    elevation: 6, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: 110,
    marginBottom:140,
  },
  stepNumberContainer: {
    position: 'absolute',
    top: -20,
    backgroundColor: '#b3b3b3',
    padding: 10,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // shadow effect
  },
  stepNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTitle: {
    color: '#4CAF50',
    marginTop: 0,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#757575',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
  },
});

export default CardComponent;
