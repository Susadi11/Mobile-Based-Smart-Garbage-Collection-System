import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { doc, deleteDoc } from "firebase/firestore"; // Import deleteDoc from Firestore
import { db } from '@/firebaseConfig';// Assuming your Firebase config file is named firebaseConfig.ts
import Navbar from '@/components/vindi/NavBar';

type ComplainReadProps = {
  route: {
    params: {
      complaintData: {
        complaintId: string;
        firstName: string;
        lastName: string;
        mobileNumber: string;
        email: string;
        location: string;
        problem: string;
      };
    };
  };
  navigation: any; // For navigating back after deletion
};

const ComplainRead: React.FC<ComplainReadProps> = ({ route, navigation }) => {
  const { complaintData } = route.params;

  // Handle Delete Function
  const handleDelete = async () => {
    // Show confirmation dialog
    Alert.alert(
      'Delete Complaint',
      'Are you sure you want to delete this complaint?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              // Reference to the specific document in Firestore
              const complaintDoc = doc(db, 'complaints', complaintData.complaintId);
              // Delete the document
              await deleteDoc(complaintDoc);
              Alert.alert('Success', 'Complaint deleted successfully.');
              navigation.goBack(); // Navigate back after deletion
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the complaint.');
              console.error("Error deleting complaint: ", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleUpdate = () => {
    Alert.alert('Update', 'Update feature is not yet implemented.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>
      <Navbar/>
      <View style={styles.card}>
        <Text style={styles.title}>Complaint Details</Text>
        <Text style={styles.label}>Complaint ID: <Text style={styles.value}>{complaintData.complaintId}</Text></Text>
        <Text style={styles.label}>First Name: <Text style={styles.value}>{complaintData.firstName}</Text></Text>
        <Text style={styles.label}>Last Name: <Text style={styles.value}>{complaintData.lastName}</Text></Text>
        <Text style={styles.label}>Mobile Number: <Text style={styles.value}>{complaintData.mobileNumber}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{complaintData.email}</Text></Text>
        <Text style={styles.label}>Location: <Text style={styles.value}>{complaintData.location}</Text></Text>
        <Text style={styles.label}>Problem: <Text style={styles.value}>{complaintData.problem}</Text></Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
  card: {
    marginTop:100,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontWeight: 'normal',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComplainRead;
