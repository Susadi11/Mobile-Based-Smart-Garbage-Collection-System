import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { app } from '../../firebaseConfig'; // Ensure the path is correct based on your project structure

type RootStackParamList = {
  ComplainRead: { complaintId: string }; // Pass complaintId instead of entire data
  // other routes...
};

type FormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ComplainRead'>;

const Form: React.FC = () => {
  const navigation = useNavigation<FormNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState('');
  const [location, setLocation] = useState<{ latitude: number, longitude: number }>({ latitude: 6.9271, longitude: 79.8612 }); // Default to Colombo
  const [region, setRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [date, setDate] = useState(''); // State to store date
  const [time, setTime] = useState(''); // State to store time

  const firestore = getFirestore(app);

  useEffect(() => {
    const currentDate = new Date();
    setDate(currentDate.toLocaleDateString()); // Format date as needed
    setTime(currentDate.toLocaleTimeString()); // Format time as needed

    // Request location permission
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is needed to select your location.');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    })();
  }, []);

  const handleLocationSelect = (coordinate: { latitude: number, longitude: number }) => {
    setLocation(coordinate);
  };

  const handleSubmit = async () => {
    // Basic form validation
    if (!firstName || !lastName || !mobileNumber || !email || !location || !problem) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const formData = {
      firstName,
      lastName,
      mobileNumber,
      email,
      location,
      problem,
      date, // Include the date
      time, // Include the time
    };

    try {
      // Save form data to Firestore
      const docRef = await addDoc(collection(firestore, 'complaints'), formData);
      const complaintId = docRef.id; // Get the document ID

      Alert.alert('Success', 'Complaint submitted successfully!');
      navigation.navigate('ComplainRead', { complaintId });

      // Reset form fields
      setFirstName('');
      setLastName('');
      setMobileNumber('');
      setEmail('');
      setProblem('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit complaint.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          
          {/* Display Current Date and Time */}
        <Text style={styles.dateTimeText}>Current Date: {date}</Text>
        <Text style={styles.dateTimeText}>Current Time: {time}</Text>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Doe"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="0771234567"
            value={mobileNumber}
            keyboardType="phone-pad"
            onChangeText={setMobileNumber}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@mail.com"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>

        {/* Map View */}
        <View style={styles.mapContainer}>
          <Text style={styles.label}>Select Your Location</Text>
          <MapView
            style={styles.map}
            region={region}
            onPress={(e) => handleLocationSelect(e.nativeEvent.coordinate)}
          >
            <Marker coordinate={location} title="Selected Location" />
          </MapView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Describe Your Problem</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Explain the issue"
            value={problem}
            multiline
            numberOfLines={4}
            onChangeText={setProblem}
          />
        </View>

       
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Complaint</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  form: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 5,
    marginTop:5,
  },
  
  input: {
    height: 50,
    borderColor: '#cbd5e0',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#edf2f7',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  dateTimeText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#4a5568',
    fontWeight:'bold',
    marginBottom:10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  
});

export default Form;
