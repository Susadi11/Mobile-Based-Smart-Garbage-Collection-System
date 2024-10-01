import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { CheckBox, Input } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  BulkPage: undefined;
};

type BulkNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BulkPage'>;

export interface TransactionItem {
  id: string;
  name: string;
  scheduleType: string;
  garbageTypes: string;
  pickupTime: string;
  pickupDate: string;
  location: { latitude: number; longitude: number };
  weight?: string | null;
}

interface BulkProps {
  existingTransaction?: TransactionItem;
  onAddComplete: (newRecord: TransactionItem) => void;
  onUpdateComplete: (updatedRecord: TransactionItem) => void;
}

const Bulk: React.FC<BulkProps> = ({ existingTransaction, onAddComplete, onUpdateComplete }) => {
  const navigation = useNavigation<BulkNavigationProp>();

  const [name, setName] = useState<string>('');
  const [scheduleType, setScheduleType] = useState<string>('');
  const [garbageTypes, setGarbageTypes] = useState<string[]>([]);
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [pickupTime, setPickupTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [location, setLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
  });
  const [weight, setWeight] = useState<string | null>(null);

  useEffect(() => {
    if (existingTransaction) {
      setName(existingTransaction.name);
      setScheduleType(existingTransaction.scheduleType);
      setGarbageTypes(existingTransaction.garbageTypes.split(', '));
      setPickupDate(new Date(existingTransaction.pickupDate));
      setPickupTime(new Date(`1970-01-01T${existingTransaction.pickupTime}`));
      setLocation(existingTransaction.location);
      setWeight(existingTransaction.weight || null);
    }
  }, [existingTransaction]);

  const firestore = getFirestore(app);

  const garbageOptions = ['Paper', 'Plastic', 'E-waste', 'Organic'];

  const handleGarbageTypeSelection = (type: string) => {
    setGarbageTypes(prevState =>
      prevState.includes(type)
        ? prevState.filter(item => item !== type)
        : [...prevState, type]
    );
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || pickupDate;
    setShowDatePicker(Platform.OS === 'ios');
    setPickupDate(currentDate);
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || pickupTime;
    setShowTimePicker(Platform.OS === 'ios');
    setPickupTime(currentTime);
  };

  const handleSubmit = async () => {
    // Pickup date validation: Ensure it is a future date
    if (pickupDate < new Date()) {
      Alert.alert('Error', 'Pickup date must be in the future.');
      return;
    }
  
    // Weight validation: Ensure it is a positive number if required
    if (scheduleType === 'bulk' && (weight === null || isNaN(Number(weight)) || Number(weight) <= 0)) {
      Alert.alert('Error', 'Please enter a valid positive weight.');
      return;
    }
  
    // Validation for required fields
    if (!name || !scheduleType || garbageTypes.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    const wasteData: Omit<TransactionItem, 'id'> = {
      name,
      scheduleType,
      garbageTypes: garbageTypes.join(', '),
      pickupDate: pickupDate.toISOString(),
      pickupTime: pickupTime.toLocaleTimeString(),
      location,
      weight: scheduleType === 'bulk' ? weight || null : null,
    };
  
    try {
      if (existingTransaction) {
        await updateDoc(doc(firestore, 'wasteSchedules', existingTransaction.id), wasteData);
        Alert.alert('Success', 'Waste scheduling updated successfully');
        onUpdateComplete({ id: existingTransaction.id, ...wasteData });
      } else {
        const docRef = await addDoc(collection(firestore, 'wasteSchedules'), wasteData);
        const newRecord: TransactionItem = { id: docRef.id, ...wasteData };
        Alert.alert('Success', 'Waste scheduling saved successfully');
        onAddComplete(newRecord);
      }
      navigation.goBack();
    } catch (error: unknown) {
      console.error('Error adding/updating document: ', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('An unknown error occurred');
      }
    }
  };  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{existingTransaction ? 'Update Waste Scheduling' : 'New Waste Scheduling'}</Text>
      <Input
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        inputContainerStyle={styles.inputContainerStyle}
      />

      <Text style={styles.label}>Select Schedule Type:</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setScheduleType(value)}
          items={[
            { label: 'Normal Schedule', value: 'normal' },
            { label: 'Bulk Schedule', value: 'bulk' }
          ]}
          style={pickerSelectStyles}
          value={scheduleType}
        />
      </View>

      <Text style={styles.label}>Select Garbage Types:</Text>
      {garbageOptions.map((type, index) => (
        <CheckBox
          key={index}
          title={type}
          checked={garbageTypes.includes(type)}
          onPress={() => handleGarbageTypeSelection(type)}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxText}
          checkedColor="#10b981"
          uncheckedColor="#d1d5db"
        />
      ))}

      <Text style={styles.label}>Select Pickup Date:</Text>
      <TouchableOpacity 
        style={[styles.button, showDatePicker && styles.buttonActive]} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>Set Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={pickupDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          textColor="#10b981"
        />
      )}

      <Text style={styles.label}>Select Pickup Time:</Text>
      <TouchableOpacity 
        style={[styles.button, showTimePicker && styles.buttonActive]} 
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.buttonText}>Set Time</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={pickupTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
          textColor="#10b981"
        />
      )}

      <Text style={styles.label}>Select Location:</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.9271,
          longitude: 79.8612,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => setLocation(e.nativeEvent.coordinate)}
      >
        <Marker coordinate={location} />
      </MapView>

      {scheduleType === 'bulk' && (
        <Input
          placeholder="Enter estimated weight (kg)"
          value={weight || ''}
          onChangeText={(text) => setWeight(text || null)}
          keyboardType="numeric"
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainerStyle}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{existingTransaction ? 'Update' : 'Submit'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#047857', // text-green-700
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: '#1f2937', // text-gray-800
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#1f2937', // text-gray-800
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: 10, // Rounded corners
    marginBottom: 12,
    overflow: 'hidden',
  },
  checkboxContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: 10, // Rounded corners
    padding: 12,
    marginBottom: 8,
  },
  checkboxText: {
    fontSize: 16,
    color: '#4b5563', // text-gray-600
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 12,
    borderRadius: 10, // Rounded corners
  },
  button: {
    backgroundColor: '#10b981', // bg-green-500
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10, // Rounded corners
    marginBottom: 12,
  },
  buttonActive: {
    backgroundColor: '#059669', // bg-green-600
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#059669', // bg-green-600
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10, // Rounded corners
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: 10, // Rounded corners
    color: '#4b5563', // text-gray-600
    backgroundColor: '#ffffff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: 10, // Rounded corners
    color: '#4b5563', // text-gray-600
    backgroundColor: '#ffffff',
  },
});

export default Bulk;