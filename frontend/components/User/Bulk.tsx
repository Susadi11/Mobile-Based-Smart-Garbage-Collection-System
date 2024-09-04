import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Alert, Platform } from 'react-native';
import { CheckBox, Input } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  BulkPage: undefined;
  AddBulkPage: { onAddComplete: (newRecord: TransactionItem) => void };
};

type AddBulkPageRouteProp = RouteProp<RootStackParamList, 'AddBulkPage'>;
type AddBulkPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddBulkPage'>;

export interface TransactionItem {
  id: string;
  scheduleType: string;
  garbageTypes: string;
  pickupTime: string;
  pickupDate: string;
}

const Bulk: React.FC = () => {
    const navigation = useNavigation<AddBulkPageNavigationProp>();
    const route = useRoute<AddBulkPageRouteProp>();
    const { onAddComplete } = route.params;

    const [name, setName] = useState<string>('');
    const [scheduleType, setScheduleType] = useState<string>('');
    const [garbageTypes, setGarbageTypes] = useState<string[]>([]);
    const [pickupDate, setPickupDate] = useState<Date>(new Date());
    const [pickupTime, setPickupTime] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [location, setLocation] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    });
    const [weight, setWeight] = useState<string>('');

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

        const wasteData = {
            name,
            scheduleType,
            garbageTypes: garbageTypes.join(', '),
            pickupDate: pickupDate.toISOString(),
            pickupTime: pickupTime.toLocaleTimeString(),
            location,
            weight: scheduleType === 'bulk' ? weight : null,
        };

        try {
            const docRef = await addDoc(collection(firestore, 'wasteSchedules'), wasteData);
            console.log('Document written with ID: ', docRef.id);
            Alert.alert('Success', 'Waste scheduling saved successfully');
            
            // Call the onAddComplete function with the new record
            onAddComplete({
                id: docRef.id,
                scheduleType,
                garbageTypes: garbageTypes.join(', '),
                pickupDate: pickupDate.toISOString(),
                pickupTime: pickupTime.toLocaleTimeString(),
            });

            // Navigate back to the BulkPage
            navigation.goBack();
        } catch (error: unknown) {
            console.error('Error adding document: ', error);
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('An unknown error occurred');
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Waste Scheduling</Text>

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
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    containerStyle={styles.inputContainer}
                />
            )}

            <Button title="Submit" onPress={handleSubmit} />
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