import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ComplainDash: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complain Dashboard</Text>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>ProgressBar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.text1}>Welcome, Admin</Text>
          <Image
            source={{ uri: 'https://www.slnsoftwares.com/images/benefit-complaint-system.webp' }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>
            "Got a problem? Let us know by submitting your complaint. We’ll make sure it gets to the right place and help you resolve it quickly. Click 'Add Complaint' to get started."
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() =>navigation.navigate('AddComplaint')} // Navigate to AddComplaint
          >
            <Text style={styles.cardButtonText}>Add Complaint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  text1: {
    fontSize: 12,
    marginBottom: 20,
    marginRight: 220,
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'gray',
    paddingVertical: 10,
  },
  navItem: {
    padding: 10,
  },
  navText: {
    color: 'white',
    fontSize: 16,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    marginBottom: 20,
    padding: 15,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cardButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ComplainDash;
