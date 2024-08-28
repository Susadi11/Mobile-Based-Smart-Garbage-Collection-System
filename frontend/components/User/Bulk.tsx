import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Alert } from 'react-native';
import { CheckBox, Input } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Your Firebase configuration

const Bulk = () => {
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
        setShowDatePicker(false);
        if (selectedDate) setPickupDate(selectedDate);
    };

    const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
        setShowTimePicker(false);
        if (selectedTime) setPickupTime(selectedTime);
    };

    const handleSubmit = async () => {
        if (!name || !scheduleType || garbageTypes.length === 0) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const wasteData = {
            name,
            scheduleType,
            garbageTypes,
            pickupDate: pickupDate.toISOString(),
            pickupTime: pickupTime.toISOString(),
            location,
            weight: scheduleType === 'bulk' ? weight : null,
        };

        try {
            const docRef = await addDoc(collection(firestore, 'wasteSchedules'), wasteData);
            console.log('Document written with ID: ', docRef.id);
            Alert.alert('Success', 'Waste scheduling saved successfully');
            // Reset the form
            setName('');
            setScheduleType('');
            setGarbageTypes([]);
            setPickupDate(new Date());
            setPickupTime(new Date());
            setWeight('');
            setLocation({ latitude: 37.78825, longitude: -122.4324 });
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
                    value={pickupDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.label}>Select Pickup Time:</Text>
            <Button title="Set Time" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker
                    value={pickupTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <Text style={styles.label}>Select Location:</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
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
                    value={weight}
                    onChangeText={setWeight}
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
        height: 200,
        marginVertical: 15,
    },
});

const pickerSelectStyles = {
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
};

export default Bulk;