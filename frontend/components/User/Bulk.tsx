import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Alert, Platform } from 'react-native';
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
    if (!name || !scheduleType || garbageTypes.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
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
        // Update existing document
        await updateDoc(doc(firestore, 'wasteSchedules', existingTransaction.id), wasteData);
        Alert.alert('Success', 'Waste scheduling updated successfully');
        onUpdateComplete({ id: existingTransaction.id, ...wasteData });
      } else {
        // Add new document
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
            />

            <Text style={styles.label}>Select Schedule Type:</Text>
            <RNPickerSelect
                onValueChange={(value) => setScheduleType(value)}
                items={[
                    { label: 'Normal Schedule', value: 'normal' },
                    { label: 'Bulk Schedule', value: 'bulk' }
                ]}
                style={pickerSelectStyles}
                value={scheduleType}
            />

            <Text style={styles.label}>Select Garbage Types:</Text>
            {garbageOptions.map((type, index) => (
                <CheckBox
                    key={index}
                    title={type}
                    checked={garbageTypes.includes(type)}
                    onPress={() => handleGarbageTypeSelection(type)}
                    containerStyle={styles.checkboxContainer}
                />
            ))}

            <Text style={styles.label}>Select Pickup Date:</Text>
            <Button title="Set Date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={pickupDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.label}>Select Pickup Time:</Text>
            <Button title="Set Time" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={pickupTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <Text style={styles.label}>Select Location:</Text>
            <MapView
    style={styles.map}
    initialRegion={{
        latitude: 6.9271,  // Colombo, Sri Lanka Latitude
        longitude: 79.8612, // Colombo, Sri Lanka Longitude
        latitudeDelta: 0.0922, // Zoom level
        longitudeDelta: 0.0421, // Zoom level
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
  />
)}

          <Button title={existingTransaction ? 'Update' : 'Submit'} onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
        color: '#555',
    },
    inputContainer: {
        marginBottom: 15,
    },
    checkboxContainer: {
        backgroundColor: '#fff',
        borderWidth: 0,
        padding: 10,
    },
    map: {
        width: '100%',
        height: 700,
        marginVertical: 15,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
});

export default Bulk;