import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

type RootStackParamList = {
  HomePage: undefined;
  StorePage: undefined;
};

type HomeUsNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
}

const HomeUs: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scaleValue] = useState(new Animated.Value(1)); // For scaling animation
  const navigation = useNavigation<HomeUsNavigationProp>();
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(firestore, 'products');
        const querySnapshot = await getDocs(productsRef);

        const productList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Product',
            imageUrl: data.imageUrl || '',
            unitPrice: data.unitPrice || 0,
          };
        });

        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const navigateToStorePage = () => {
    navigation.navigate('StorePage');
  };

  const renderProductCard = (product: Product) => (
    <Animated.View key={product.id} style={[styles.eventCard, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={() => Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start()}
        onPress={() => navigation.navigate('StorePage')}
      >
        <Image 
          source={{ uri: product.imageUrl }} 
          style={styles.productImage} 
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.priceText}>Rs {product.unitPrice.toFixed(2)}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ecolife</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.sectionTitle}>Explore Products</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {loading ? (
          <Text>Loading products...</Text>
        ) : products.length > 0 ? (
          products.slice(-5).map(renderProductCard)
        ) : (
          <Text>No products found.</Text>
        )}
        <TouchableOpacity style={[styles.eventCard, styles.exploreMoreCard]} onPress={navigateToStorePage}>
          <Icon name="arrow-forward" size={40} color="#4b5563" />
          <Text style={styles.moreCardText}>Explore More Products</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#111827',
  },
  searchBar: {
    height: 40,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginTop: 20,
  },
  eventCard: {
    width: 200,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  exploreMoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  moreCardText: {
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HomeUs;
