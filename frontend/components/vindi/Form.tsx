import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {app} from '../../firebaseConfig' // Ensure the path is correct based on your project structure


const Form = () => {
  const [complaintId, setComplaintId] = useState(() => Math.floor(Math.random() * 1000000).toString());
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [location,setLocation] = useState('');
  const [problem, setProblem] = useState('');

  const firestore = getFirestore(app);

  const handleSubmit = async () => {
    const formData = {
      complaintId,
      firstName,
      lastName,
      mobileNumber,
      email,
      location,
      problem,
    };

    try {
      // Save form data to Firestore
      const docRef = await addDoc(collection(firestore, 'complaints'), formData);
      console.log('Document written with ID: ', docRef.id);
      Alert.alert('Success', 'Complaint submitted successfully!');
      
      // Reset form fields
      setComplaintId(Math.floor(Math.random() * 1000000).toString());
      setFirstName('');
      setLastName('');
      setMobileNumber('');
      setEmail('');
      setLocation('');
      setProblem('');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Complaint Form</Text>

      <Text style={styles.para}>Please fill out form with your complain. we review your request and follow up with you as soon as possible.</Text>

      <Text style={styles.label}>Complaint ID: {complaintId}</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your first name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your last name"
        value={lastName}
        onChangeText={setLastName}
      />


      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your mobile number"
        value={mobileNumber}
        keyboardType="phone-pad"
        onChangeText={setMobileNumber}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      
<Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Problem</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your problem"
        value={problem}
        multiline
        numberOfLines={4}
        onChangeText={setProblem}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  para:{
    fontSize:12,
    color:'#4a5568',
    marginBottom:20,
    backgroundColor:'#d5fddf',
  },
  title: {
    color: '#4a5568',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: 'bold',
    marginBottom: 5,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3182ce',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Form;
