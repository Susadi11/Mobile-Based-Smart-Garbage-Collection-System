import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Navbar from '@/components/vindi/NavBar';

type RootStackParamList = {
  ComplainDash: undefined;
  AddComplaint: undefined; // Adjust if you need to pass any parameters
};

type ComplainDashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ComplainDash'>;

const ComplainDash: React.FC = () => {
  const navigation = useNavigation<ComplainDashNavigationProp>();

  const handleAddComplaint = () => {
    navigation.navigate('AddComplaint');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>
        <Navbar/>
          
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text >Welcome, Admin</Text>
          <Image
            source={{ uri: 'https://www.slnsoftwares.com/images/benefit-complaint-system.webp' }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>
            "Got a problem? Let us know by submitting your complaint. We’ll make sure it gets to the right place and help you resolve it quickly. Click 'Add Complaint' to get started."
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={handleAddComplaint} // Navigate to AddComplaint
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
  headerTitle: {
    fontSize: 20,
    color: 'black',
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
    backgroundColor: '#00A36C',
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
