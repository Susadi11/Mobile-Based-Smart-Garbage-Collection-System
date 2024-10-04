import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRoute } from '@react-navigation/native';

type FormData = {
  name: string;
  phone: string;
  email: string;
  amount: string;
  date: string;
  time: string;
  urbanCouncil: string;
  
  
};

type RootStackParamList = {
  PlaceOrder:{ unitPrice: number };
  Invoice: { formData: FormData; invoiceNumber: string; totalPrice: number; unitPrice: number };
};

type PlaceOrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceOrder'>;

 

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
    
  }
);

  const [selectedCouncil, setSelectedCouncil] = useState<string | null>(null);
  const route = useRoute();
  const { unitPrice } = route.params as { unitPrice: number };

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const generateInvoiceNumber = () => {
    return `INV-${Math.floor(Math.random() * 1000000)}`; // Generate random invoice number
  };

  const handleSubmit = async () => {
    if (!selectedCouncil || !formData.amount || isNaN(Number(formData.amount))) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    
    // if (isNaN(amountValue) || amountValue <= 0) {
    //   Alert.alert('Error', 'Please enter a valid amount.');
    //   return;
    // }

    const unitPrice = 150;
    const totalPrice = unitPrice * Number(formData.amount);
    
    console.log('Amount', formData.amount);
    console.log('Unit Price', unitPrice);
    console.log('Total Price', totalPrice);

    
    // Calculate totalPrice using the unitPrice prop
    const invoiceNumber = generateInvoiceNumber();

    const orderData = {
      ...formData,
      amount: formData.amount,
      urbanCouncil: selectedCouncil,
      totalPrice,
      invoiceNumber,
      date: date ? date.toISOString().split('T')[0] : '', // Format the date
      time: time ? time.toISOString().split('T')[1].slice(0, 5) : '', // Format the time
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      navigation.navigate('Invoice', {
        formData: orderData,
        invoiceNumber,
        totalPrice,
        unitPrice,
      });
    } catch (error) {
      console.error('Error saving order: ', error);
      Alert.alert('Error', 'Failed to place the order. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
         <Text style={styles.topic}>Fill to Place an Order</Text>
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

        {/* Date Picker */}
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{date ? date.toDateString() : 'Select Date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  setDate(selectedDate || date);
                }}
              />
            )}
          </View>

          {/* Time Picker */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
              <Text>{time ? time.toTimeString().slice(0, 5) : 'Select Time'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  setTime(selectedTime || time);
                }}
              />
            )}
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
            // Add more councils as needed
          ]}
          placeholder={{ label: 'Order picking urban council...', value: null }}
          style={{
            inputIOS: styles.input,
            inputAndroid: styles.input,
          }}
        />

        {/* Confirm Order Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
          <Text style={styles.confirmButtonText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    fontFamily: 'Inter_400Regular',
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
  topic: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 20,
    padding: 10,
    paddingLeft: 80,
     
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButton: {
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Inter_400Regular',
  },
});

export default PlaceOrder;
