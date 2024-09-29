import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Ensure the path is correct based on your project structure
import { RouteProp } from '@react-navigation/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Navbar from '@/components/vindi/NavBar';

type RootStackParamList = {
  ComplainRead: { complaintId: string };
  // other routes...
};

type ComplainReadRouteProp = RouteProp<RootStackParamList, 'ComplainRead'>;

type FormData = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  location: string;
  problem: string;
};

const ComplainRead: React.FC = () => {
  const route = useRoute<ComplainReadRouteProp>();
  const navigation = useNavigation();
  const { complaintId } = route.params;
  const [complaintData, setComplaintData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    location: '',
    problem: '',
  });

  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const docRef = doc(firestore, 'complaints', complaintId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setComplaintData(docSnap.data() as FormData);
          setFormData(docSnap.data() as FormData);
        } else {
          setError('No such complaint found!');
        }
      } catch (err) {
        setError('Error fetching complaint data!');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId, firestore]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(firestore, 'complaints', complaintId), formData);
      Alert.alert('Success', 'Complaint updated successfully!');
      setEditable(false);
    } catch (err) {
      console.error('Error updating document: ', err);
      Alert.alert('Error', 'Failed to update complaint. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, 'complaints', complaintId));
      Alert.alert('Success', 'Complaint deleted successfully!');
      navigation.goBack(); // Navigate back to the previous screen
    } catch (err) {
      console.error('Error deleting document: ', err);
      Alert.alert('Error', 'Failed to delete complaint. Please try again.');
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    Alert.alert('Error', error);
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>
      <Navbar/>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Complaint Details</Text>
          {complaintData && (
            <>
              {editable ? (
                <>
                  <Text style={styles.label}>Full Name:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                    placeholder="Enter first name"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                    placeholder="Enter last name"
                  />

                  <Text style={styles.label}>Mobile Number:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.mobileNumber}
                    onChangeText={(text) => handleChange('mobileNumber', text)}
                    placeholder="Enter mobile number"
                    keyboardType="phone-pad"
                  />

                  <Text style={styles.label}>Email:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                    placeholder="Enter email"
                    keyboardType="email-address"
                  />

                  <Text style={styles.label}>Location:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(text) => handleChange('location', text)}
                    placeholder="Enter location"
                  />

                  <Text style={styles.label}>Problem:</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.problem}
                    onChangeText={(text) => handleChange('problem', text)}
                    placeholder="Describe problem"
                    multiline
                    numberOfLines={4}
                  />

                  <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update Complaint</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={() => setEditable(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.label}>Full Name:</Text>
                  <Text style={styles.info}>{complaintData.firstName} {complaintData.lastName}</Text>

                  <Text style={styles.label}>Mobile Number:</Text>
                  <Text style={styles.info}>{complaintData.mobileNumber}</Text>

                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.info}>{complaintData.email}</Text>

                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.info}>{complaintData.location}</Text>

                  <Text style={styles.label}>Problem:</Text>
                  <Text style={styles.info}>{complaintData.problem}</Text>

                  <TouchableOpacity style={styles.button} onPress={() => setEditable(true)}>
                    <Text style={styles.buttonText}>Edit Complaint</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Delete Complaint</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 25,
    color: 'black',
    fontWeight:'bold',
  },
  scrollViewContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 40,
    elevation: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#edf2f7',
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#4a5568',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50', // Blue color for update button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#e53e3e', // Red color for delete button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComplainRead;
