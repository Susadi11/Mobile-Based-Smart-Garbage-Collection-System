import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

interface Product {
    id: string;
    name: string;
    unitPrice: string;
    description: string;
    composition: string;
    benifits: string;
}

const StoreDash = ({ navigation }: any) => {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = () => {
        const firestore = getFirestore(app);
        const productsCollection = collection(firestore, 'products');

        // Listen for real-time updates
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
                    benifits: data.benifits,
                });
            });

            setProducts(fetchedProducts);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    };
    const handleDelete = async (id: string) => {
        try {
            const firestore = getFirestore(app);
            const productDoc = doc(firestore, 'products', id);

            // Delete the product from Firestore
            await deleteDoc(productDoc);

            // Optionally, update the local state to remove the deleted product
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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.shadowContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Products Dashboard</Text>
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => navigation.navigate('AddProduct')}
                        >
                            <Text style={styles.addButtonText}>Add Product</Text>
                        </TouchableOpacity>
                    </View>
                    {products.map((product) => (
                        <View key={product.id} style={styles.productContainer}>
                            <Image source={{ uri: 'https://i.ibb.co/6gzWwSq/Rectangle-20-1.png' }} style={styles.productImage} />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <View style={styles.productNameContainer}>
                                    <Text style={styles.productName}>Price: ${product.unitPrice}</Text>
                                </View>
                                <Text style={styles.productDescription}>{product.description}</Text>
                                <Text style={styles.productDescription}>{product.composition}</Text>
                                <Text style={styles.productDescription}>{product.benifits}</Text>
                                <View style={styles.productFooter}>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity style={styles.updateButton}>
                                            <Text style={styles.updateButtonText}>Update</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.deleteButton}
                                            onPress={() => handleDelete(product.id)}
                                        >
                                            <Text style={styles.deleteButtonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        padding: 10,
    },
    shadowContainer: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        marginBottom: 10,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    productContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    productImage: {
        width: '25%',
        height: 100,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    productDetails: {
        paddingLeft: 10,
        flex: 1,
        justifyContent: 'center',
    },
    productNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4a4a4a',
    },
    productDescription: {
        fontSize: 12,
        color: '#7d7d7d',
        paddingTop: 4,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    updateButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 10,
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
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#33bbff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default StoreDash;
