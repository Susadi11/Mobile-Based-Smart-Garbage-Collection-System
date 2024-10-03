import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
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

const PlaceOrder = () => {
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
    const unitPrice = 10; 
  
    const handleChange = (name: keyof FormData, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const generateInvoiceNumber = () => {
        return `INV-${Math.floor(Math.random() * 1000000)}`; // Generate random invoice number
    };

    const handleSubmit = async () => {
 
        if ( !selectedCouncil) {
 
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

 
        const totalPrice = Number(unitPrice) * parseFloat(formData.amount);
        const invoiceNumber = generateInvoiceNumber();

        const orderData = {
            ...formData,
            amount: formData.amount,
            urbanCouncil: selectedCouncil,
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
              
            });
        } catch (error) {
            console.error('Error saving order: ', error);
            Alert.alert('Error', 'Failed to place the order. Please try again.');
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

                <View style={styles.row}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={formData.date}
                            onChangeText={(text) => handleChange('date', text)}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Time</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="HH:MM"
                            value={formData.time}
                            onChangeText={(text) => handleChange('time', text)}
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                </View>

                <Text style={styles.label}>Urban Council</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedCouncil(value)}
                    items={[
                        { label: 'Colombo Municipal Council', value: 'Colombo Municipal Council' },
                        { label: 'Kandy Municipal Council', value: 'Kandy Municipal Council' },
                        { label: 'Galle Municipal Council', value: 'Galle Municipal Council' },
                        { label: 'Matara Municipal Council', value: 'Matara Municipal Council' },
                        { label: 'Negombo Municipal Council', value: 'Negombo Municipal Council' },
                        { label: 'Jaffna Municipal Council', value: 'Jaffna Municipal Council' },
                        { label: 'Dehiwala-Mount Lavinia Municipal Council', value: 'Dehiwala-Mount Lavinia Municipal Council' },
                        { label: 'Moratuwa Municipal Council', value: 'Moratuwa Municipal Council' },
                        { label: 'Kurunegala Municipal Council', value: 'Kurunegala Municipal Council' },
                        { label: 'Ratnapura Municipal Council', value: 'Ratnapura Municipal Council' },
                        { label: 'Badulla Municipal Council', value: 'Badulla Municipal Council' },
                                    ]}
                    placeholder={{ label: 'Order picking urban council...', value: null }}
                    style={{
                        inputIOS: styles.input,
                        inputAndroid: styles.input,
                    }}
                />

                <Text style={styles.subLabel}>Address Details</Text>

                <View style={styles.row}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter area"
                            value={formData.area}
                            onChangeText={(text) => handleChange('area', text)}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter city"
                            value={formData.city}
                            onChangeText={(text) => handleChange('city', text)}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter state"
                            value={formData.state}
                            onChangeText={(text) => handleChange('state', text)}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Post Code"
                            value={formData.postCode}
                            onChangeText={(text) => handleChange('postCode', text)}
                        />
                    </View>
                </View>

                <Button
                    title="Confirm Order"
                    onPress={handleSubmit}
                    color="#6A64F1"
                />
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
        shadowRadius: 8,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subLabel: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputWrapper: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default PlaceOrder;
