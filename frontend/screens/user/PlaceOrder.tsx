import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

type FormData = {
    name: string;
    phone: string;
    email: string;
    amount: string;
    date: string;
    time: string;
    urbanCouncil: string;
    area: string;
    city: string;
    state: string;
    postCode: string;
};

type RootStackParamList = {
    PlaceOrder: undefined;
    Invoice: { formData: FormData; invoiceNumber: string; totalPrice: number;  unitPrice: number };
};

type PlaceOrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceOrder'>;

interface PlaceOrderProps {
    unitPrice: number; // Expecting unitPrice as a prop
}

const PlaceOrder = ({ unitPrice }: PlaceOrderProps) => {
    const navigation = useNavigation<PlaceOrderScreenNavigationProp>();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        email: '',
        amount: '',
        date: '',
        time: '',
        urbanCouncil: '',
        area: '',
        city: '',
        state: '',
        postCode: ''
    });

    const [selectedCouncil, setSelectedCouncil] = useState<string | null>(null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const generateInvoiceNumber = () => {
        return `INV-${Math.floor(Math.random() * 1000000)}`; // Generate random invoice number
    };

    const handleSubmit = async () => {
        const { name, phone, email, amount, urbanCouncil, area, city, state, postCode } = formData;

        if (!name || !phone || !email || !amount || !selectedDate || !selectedTime || !area || !city || !state || !postCode) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

       

        const totalPrice = unitPrice * parseFloat(amount); // Calculate total price
        const invoiceNumber = generateInvoiceNumber();

        const orderData = {
            ...formData,
            amount , // Store amount as string in orderData
            date: selectedDate?.toISOString().split('T')[0],
            time: selectedTime?.toTimeString().split(' ')[0],
            urbanCouncil: selectedCouncil || '',
            totalPrice,
            invoiceNumber,
            createdAt: new Date().toISOString(),
        };

        try {
            await addDoc(collection(db, 'orders'), orderData);
            navigation.navigate('Invoice', {
                formData: orderData,
                invoiceNumber,
                totalPrice,
                unitPrice
            });
        } catch (error) {
            console.error('Error saving order: ', error);
            Alert.alert('Error', 'Failed to place the order. Please try again.');
        }
    };

    const handleDateChange = (event: any, selectedDateValue?: Date) => {
        setShowDatePicker(false);
        if (selectedDateValue) {
            setSelectedDate(selectedDateValue);
            handleChange('date', selectedDateValue.toISOString().split('T')[0]);
        }
    };

    const handleTimeChange = (event: any, selectedTimeValue?: Date) => {
        setShowTimePicker(false);
        if (selectedTimeValue) {
            setSelectedTime(selectedTimeValue);
            handleChange('time', selectedTimeValue.toTimeString().split(' ')[0]);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={formData.name}
                    onChangeText={(text) => handleChange('name', text)}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChangeText={(text) => handleChange('phone', text)}
                    keyboardType="numeric"
                    maxLength={10}
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                    keyboardType="email-address"
                    onBlur={() => {
                        if (!formData.email.includes('@')) {
                            Alert.alert('Please enter a valid email address');
                        }
                    }}
                />

                <Text style={styles.label}>Amount</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Quantity"
                    value={formData.amount}
                    onChangeText={(text) => handleChange('amount', text)}
                    keyboardType="numeric"
                    maxLength={3}
                />

                <Text style={styles.label}>Select Date</Text>
                <Button title={selectedDate ? selectedDate.toDateString() : "Pick Date"} onPress={() => setShowDatePicker(true)} />
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()} // Prevent past date selection
                    />
                )}

                <Text style={styles.label}>Select Time</Text>
                <Button title={selectedTime ? selectedTime.toTimeString().split(' ')[0] : "Pick Time"} onPress={() => setShowTimePicker(true)} />
                {showTimePicker && (
                    <DateTimePicker
                        value={selectedTime || new Date()}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}

                <Text style={styles.label}>Urban Council</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedCouncil(value)}
                    items={[
                        { label: 'Colombo Municipal Council', value: 'Colombo Municipal Council' },
                        { label: 'Kandy Municipal Council', value: 'Kandy Municipal Council' },
                        // Add other urban councils here
                    ]}
                    placeholder={{ label: 'Select Urban Council...', value: null }}
                    style={{ inputIOS: styles.input, inputAndroid: styles.input }}
                />

                {/* Area Input */}
                <Text style={styles.label}>Area</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Area"
                    value={formData.area}
                    onChangeText={(text) => handleChange('area', text)}
                />

                {/* City Input */}
                <Text style={styles.label}>City</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter City"
                    value={formData.city}
                    onChangeText={(text) => handleChange('city', text)}
                />

                {/* State Input */}
                <Text style={styles.label}>State</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter State"
                    value={formData.state}
                    onChangeText={(text) => handleChange('state', text)}
                />

                {/* PostCode Input */}
                <Text style={styles.label}>Post Code</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Post Code"
                    value={formData.postCode}
                    onChangeText={(text) => handleChange('postCode', text)}
                    keyboardType="numeric"
                    maxLength={5}
                />

                <Button title="Confirm Order" onPress={handleSubmit} color="#6A64F1" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
});

export default PlaceOrder;
