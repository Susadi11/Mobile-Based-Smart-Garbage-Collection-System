import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Ensure the path is correct based on your project structure
import { RouteProp } from '@react-navigation/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Navbar from '@/components/vindi/NavBar';

type RootStackParamList = {
  ComplainRead: { complaintId: string };
};

type ComplainReadRouteProp = RouteProp<RootStackParamList, 'ComplainRead'>;

type FormData = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  location: {
    latitude: number; // Define latitude as a number
    longitude: number; // Define longitude as a number
  };
  problem: string;
  date: string; // Add date field
  time: string; // Add time field
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
    location: {
      latitude: 0, // Default value
      longitude: 0, // Default value
    },
    problem: '',
    date: '', // Initialize date
    time: '', // Initialize time
  });

  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const docRef = doc(firestore, 'complaints', complaintId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as FormData;
          setComplaintData(data);
          setFormData(data);
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
      navigation.goBack();
    } catch (err) {
      console.error('Error deleting document: ', err);
      Alert.alert('Error', 'Failed to delete complaint. Please try again.');
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleLocationChange = (field: 'latitude' | 'longitude', value: string) => {
    setFormData(prevData => ({
      ...prevData,
      location: {
        ...prevData.location,
        [field]: parseFloat(value),
      },
    }));
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
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Complaint Details</Text>
          {complaintData && (
            <>
              {editable ? (
                <>
                  {/* Editable Fields */}
                  <Text style={styles.label}>First Name:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                  />
                  <Text style={styles.label}>Last Name:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                  />
                  <Text style={styles.label}>Mobile Number:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.mobileNumber}
                    onChangeText={(text) => handleChange('mobileNumber', text)}
                  />
                  <Text style={styles.label}>Email:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                  />
                  <Text style={styles.label}>Location:</Text>
                  <View style={styles.locationInputContainer}>
                    <TextInput
                      style={styles.locationInput}
                      value={formData.location.latitude.toString()}
                      onChangeText={(text) => handleLocationChange('latitude', text)}
                      placeholder="Latitude"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.locationInput}
                      value={formData.location.longitude.toString()}
                      onChangeText={(text) => handleLocationChange('longitude', text)}
                      placeholder="Longitude"
                      keyboardType="numeric"
                    />
                  </View>
                  <Text style={styles.label}>Problem:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.problem}
                    onChangeText={(text) => handleChange('problem', text)}
                  />
                  <Text style={styles.label}>Date:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.date}
                    onChangeText={(text) => handleChange('date', text)}
                    placeholder="YYYY-MM-DD"
                  />
                  <Text style={styles.label}>Time:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.time}
                    onChangeText={(text) => handleChange('time', text)}
                    placeholder="HH:MM"
                  />
                </>
              ) : (
                <>
                  {/* Display Data when not editable */}
                  <Text style={styles.label}>First Name:</Text>
                  <Text style={styles.info}>{complaintData.firstName}</Text>
                  <Text style={styles.label}>Last Name:</Text>
                  <Text style={styles.info}>{complaintData.lastName}</Text>
                  <Text style={styles.label}>Mobile Number:</Text>
                  <Text style={styles.info}>{complaintData.mobileNumber}</Text>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.info}>{complaintData.email}</Text>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.info}>
                    Latitude: {complaintData.location.latitude}, Longitude: {complaintData.location.longitude}
                  </Text>
                  <Text style={styles.label}>Problem:</Text>
                  <Text style={styles.info}>{complaintData.problem}</Text>
                  <Text style={styles.label}>Date:</Text>
                  <Text style={styles.info}>{complaintData.date}</Text>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={styles.info}>{complaintData.time}</Text>
                </>
              )}
            </>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setEditable(!editable)}>
            <Text style={styles.buttonText}>{editable ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
          {editable && (
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollViewContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
    color: '#34495e',
    
  },
  info: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#34495e',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ecf0f1',
    marginBottom: 12,
  },
  locationInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#34495e',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ecf0f1',
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ComplainRead;
