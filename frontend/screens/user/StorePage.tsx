import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, TextInput, ImageBackground, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const StorePage = ({ navigation }: any) => {
    const [products, setProducts] = useState<{ id: string; name: string; unitPrice: number; imageUrl: string; description: string; composition: string; benifits: string; }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const firestore = getFirestore(app);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'products'));
                const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; name: string; unitPrice: number; imageUrl: string; description: string; composition: string; benifits: string; }[];
                setProducts(productList);
            } catch (error) {
                console.error('Error fetching products: ', error);
                Alert.alert('Error', 'Unable to fetch products');
            }
        };

        fetchProducts();
    }, []);

    
        const handlePlaceOrder = (product: any) => {
            // Navigate to PlaceOrder screen with product data as params
            navigation.navigate('PlaceOrder', { product });
        };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView style={styles.container}>
            <ImageBackground
                source={{ uri: ' https://media.istockphoto.com/id/953464358/photo/hand-holding-fertile-soil-for-plant-to-growing-in-nature-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=aA94ULeQKWv1Bf6kSnCmz-c2MhJ-DEhnMDG0PE04u7k=' }}
                style={styles.background}
                
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>Exlpore Fertilizers</Text>
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

            {filteredProducts.map(item => (
                <View key={item.id} style={styles.productCard}>
                    <TouchableOpacity style={styles.imageContainer} onPress={() => { /* Handle image press */ }}>
                        {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.productImage} />}
                    </TouchableOpacity>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>${item.unitPrice.toFixed(2)}</Text>
                        </View>
                        <Text style={styles.productDescription}>{item.description}</Text>
                        <Text style={styles.productDescription}>{item.composition}</Text>
                        <Text style={styles.productDescription}>{item.benifits}</Text>
                        <TouchableOpacity style={styles.orderButton} onPress={() => handlePlaceOrder(item)}>
                            <Icon name="shopping-cart" size={20} color="#fff" />
                            <Text style={styles.orderButtonText}>Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    background: {
        width: '100%',
        height: 200,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 52,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24,
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
    productCard: {
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 16,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 15,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    priceContainer: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
    },
    productDescription: {
        fontSize: 14,
        color: '#333',
        marginVertical: 10,
    },
    orderButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default StorePage;
