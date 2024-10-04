import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { app } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
  ComplainRead: { complaintId: string };
};

type FormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ComplainRead'>;

const Form: React.FC = () => {
  const navigation = useNavigation<FormNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState('');
  const [location, setLocation] = useState<{ latitude: number, longitude: number }>({ latitude: 6.9271, longitude: 79.8612 });
  const [region, setRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const firestore = getFirestore(app);

  useEffect(() => {
    const currentDate = new Date();
    setDate(currentDate.toLocaleDateString());
    setTime(currentDate.toLocaleTimeString());

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (number: string) => {
    const mobileRegex = /^[0-9]{10}$/; // Example: Only allows 10 digits
    return mobileRegex.test(number);
  };

  const handleSubmit = async () => {
    // Validate First Name
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required.');
      return;
    }

    // Validate Last Name
    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name is required.');
      return;
    }

    // Validate Mobile Number
    if (!validateMobileNumber(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate Email
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Validate Problem Description
    if (!problem.trim()) {
      Alert.alert('Error', 'Please describe your problem.');
      return;
    }

    const formData = {
      firstName,
      lastName,
      mobileNumber,
      email,
      location,
      problem,
      date,
      time,
    };

    try {
      const docRef = await addDoc(collection(firestore, 'complaints'), formData);
      const complaintId = docRef.id;

      Alert.alert('Success', 'Complaint submitted successfully!');
      navigation.navigate('ComplainRead', { complaintId });

      // Clear form fields after submission
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
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.text}>Complaint Form</Text>
        <Text style={styles.headerText}>Please complete this form and one of our agents will resolve your problem as soon as possible.</Text>
       

       

        <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name:</Text>
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name:</Text>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile:</Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={mobileNumber}
              keyboardType="phone-pad"
              onChangeText={setMobileNumber}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.label}>Email:</Text>
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>
        </View>

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
            value={problem}
            multiline
            numberOfLines={4}
            onChangeText={setProblem}
          />
        </View>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTimeText}>Current Date: {date}</Text>
          <Text style={styles.dateTimeText}> | </Text>
          <Text style={styles.dateTimeText}>Current Time: {time}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Complaint</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  headerText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#4a5568',
    textAlign: 'center',
    
 
  },
  inputGroup: {
    marginBottom: 10,
  },
  text: {
    fontSize: 30,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: 'bold',
    marginStart: 75,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 4,
    marginTop: 0,
    fontFamily: 'Inter_600SemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#34495e',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#edf2f7',
    paddingHorizontal: 15,
    
  },
  
  icon: {
    marginRight: 10,
    color: '#4a5568', // Icon color
  },
  input: {
    flex: 2,
    height: 50,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    borderColor: '#34495e',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#edf2f7',
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#4a5568',
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
