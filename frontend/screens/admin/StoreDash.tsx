import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View, Text, TouchableOpacity, Image, TextInput, ImageBackground } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

import { app } from '../../firebaseConfig';

interface Product {
    id: string;
    name: string;
    unitPrice: string;
    description: string;
    composition: string;
    benefits: string;
    imageUrl: string;
}

const StoreDash = ({ navigation }: any) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = () => {
        const firestore = getFirestore(app);
        const productsCollection = collection(firestore, 'products');

        const unsubscribe = onSnapshot(productsCollection, (querySnapshot) => {
            const fetchedProducts: Product[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedProducts.push({
                    id: doc.id,
                    name: data.name,
                    unitPrice: data.unitPrice,
                    description: data.description,
                    composition: data.composition,
                    benefits: data.benefits,
                    imageUrl: data.imageUrl,
                });
            });

            setProducts(fetchedProducts);
        });

        return () => unsubscribe();
    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Delete canceled'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => handleDelete(id),
                },
            ],
            { cancelable: true }
        );
    };

    const handleDelete = async (id: string) => {
        try {
            const firestore = getFirestore(app);
            const productDoc = doc(firestore, 'products', id);
            await deleteDoc(productDoc);
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.id !== id)
            );
            console.log('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
        
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ImageBackground
                    source={{ uri: 'https://m.media-amazon.com/images/I/41san9tTmAL._AC_UF1000,1000_QL80_.jpg' }}
                >
                    <View style={styles.overlay}>
                        <Text style={styles.title}>Product Dashboard</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Search for product"
                                placeholderTextColor="#888"
                                value={searchQuery}
                                onChangeText={text => setSearchQuery(text)}
                            />
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.productsWrapper}>
                    {filteredProducts.map((product) => (
                        <View key={product.id} style={styles.productContainer}>
                            <Image
                                source={{ uri: product.imageUrl }}
                                style={styles.productImage}
                            />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productPrice}>Price: Rs {product.unitPrice}</Text>
                                <Text style={styles.productDescription}>{product.description}</Text>
                                <Text style={styles.productComposition}>
                                    <Text style={{ fontWeight: 'bold' }}>Composition:</Text> {product.composition}
                                </Text>
                                <Text style={styles.productBenefits}>
                                    <Text style={{ fontWeight: 'bold' }}>Benefits:</Text> {product.benefits}
                                </Text>
                                <View style={styles.actionButtons}>
                                <TouchableOpacity 
                                        style={styles.updateButton}
                                        onPress={() => navigation.navigate('UpdateProduct', { productId: product.id })}
                                    >
                                        <Text style={styles.updateButtonText}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => confirmDelete(product.id)}
                                    >
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 52,
        paddingHorizontal: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    title: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 33,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        fontSize: 16,
        color: '#000',
    },
    productsWrapper: {
        flexDirection: 'column',
        gap: 20,
    },
    productContainer: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    productDetails: {
        marginLeft: 15,
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    productPrice: {
        fontSize: 20,
        color: '#4CAF50',
        marginTop: 5,
    },
    productDescription: {
        fontSize: 14,
        color: '#261d78',
        marginTop: 5,
    },
    productComposition: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    productBenefits: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    updateButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#e53935',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#33bbff',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 100,
        right: 20,
        elevation: 8,
    },
    fabText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default StoreDash;
