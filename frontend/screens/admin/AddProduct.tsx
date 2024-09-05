import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebaseConfig';
import { launchImageLibrary } from 'react-native-image-picker';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [description, setDescription] = useState('');
    const [composition, setComposition] = useState('');
    const [benefits, setBenefits] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const firestore = getFirestore(app);
    const storage = getStorage(app);

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.error('ImagePicker Error: ', response.errorCode);
            } else if (response.assets && response.assets[0]) {
                setImageUri(response.assets[0]?.uri || null);
            }
        });
    };

    const uploadImage = async () => {
        if (imageUri) {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const storageRef = ref(storage, `product_images/${Date.now()}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        }
        return null;
    };

    const createProduct = async () => {
        if (!name || !unitPrice || !description || !composition || !benefits) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const imageUrl = await uploadImage();
            const productData = {
                name,
                unitPrice: parseFloat(unitPrice),
                description,
                composition,
                benefits,
                imageUrl,
            };

            const docRef = await addDoc(collection(firestore, 'products'), productData);
            console.log('Document written with ID: ', docRef.id);
            Alert.alert('Success', 'Product published successfully');
            setName('');
            setUnitPrice('');
            setDescription('');
            setComposition('');
            setBenefits('');
            setImageUri(null);
        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Error', 'An error occurred while adding the product');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Add Product Details</Text>
            </View>
            <View style={styles.form}>
                
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Product Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter product name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Unit Price</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter unit price"
                        value={unitPrice}
                        onChangeText={setUnitPrice}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Enter product description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Composition</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Enter product composition"
                        value={composition}
                        onChangeText={setComposition}
                        multiline
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Benefits</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Enter product benefits"
                        value={benefits}
                        onChangeText={setBenefits}
                        multiline
                    />
                </View>

                <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : (
                        <Text style={styles.imagePickerText}>Select Product Image</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={createProduct}>
                    <Text style={styles.buttonText}>Publish Product</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    header: {
        backgroundColor: '#95d09b',
        padding: 20,
        borderRadius: 5,
    },
    headerText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    form: {
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
        color: '#333',
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        backgroundColor: '#f0f0f0',
    },
    imagePickerText: {
        color: '#666',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default AddProduct;
