import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig'; // Import storage from firebaseConfig
import * as ImagePicker from 'expo-image-picker';


const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [description, setDescription] = useState('');
    const [composition, setComposition] = useState('');
    const [benefits, setBenefits] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const navigation = useNavigation(); 
    const route = useRoute();
    const { productId } = route.params as { productId: string };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const docRef = doc(db, 'products', productId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const product = docSnap.data();
                    setName(product.name);
                    setUnitPrice(product.unitPrice.toString());
                    setDescription(product.description);
                    setComposition(product.composition);
                    setBenefits(product.benefits);
                    setImageUrl(product.imageUrl);
                } else {
                    Alert.alert('Error', 'Product not found');
                }
            } catch (error) {
                console.error('Error fetching product: ', error);
                Alert.alert('Error', 'Failed to fetch product details');
            }
        };

        fetchProductData();
    }, [productId]);

    const handleImagePick = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'You need to allow permission to access the gallery.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5, 
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        } else {
            console.log('Image picking was canceled');
        }
    };

    const uploadImage = async () => {
        if (imageUri) {
            try {
                const response = await fetch(imageUri);

                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const blob = await response.blob();
                const storageRef = ref(storage, `product_images/${Date.now()}`);
                console.log('Uploading to:', storageRef.fullPath);

                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);
                console.log('Download URL:', downloadURL);

                return downloadURL;
            } catch (error) {
                console.error('Error uploading image:', error);
                Alert.alert('Error', 'Failed to upload image');
            }
        } else {
            console.log('No imageUri provided');
        }
        return imageUrl; // Return existing image URL if no new image is provided
    };

    const updateProduct = async () => {
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
                imageUrl: imageUrl || imageUrl, // Use existing image URL if no new image
            };

            const docRef = doc(db, 'products', productId);
            await updateDoc(docRef, productData);
            console.log('Document updated with ID: ', productId);
            Alert.alert('Success', 'Product updated successfully');
            navigation.goBack(); 
        } catch (error) {
            console.error('Error updating document: ', error);
            Alert.alert('Error', 'An error occurred while updating the product');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Update Product Details</Text>
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
                        style={[styles.input, { height: 100 }]}
                        placeholder="Enter product description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Composition</Text>
                    <TextInput
                        style={[styles.input, { height: 100 }]}
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
                        imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={updateProduct}>
                    <Text style={styles.buttonText}>Update Product</Text>
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
        height: 40,
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

export default UpdateProduct;
