import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform } from 'react-native';

const PlaceOrder = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        area: '',
        city: '',
        state: '',
        postCode: ''
    });

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        alert('Appointment Booked');
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
                />
                
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#07074D',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    inputWrapper: {
        flex: 1,
        marginHorizontal: 5,
    },
    subLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#07074D',
        marginBottom: 16,
    },
});

export default PlaceOrder;
