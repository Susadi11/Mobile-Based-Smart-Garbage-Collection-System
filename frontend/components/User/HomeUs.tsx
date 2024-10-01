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
  ProfilePage: undefined;
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
  const [scaleValue] = useState(new Animated.Value(1));
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

  const navigateToProfilePage = () => {
    navigation.navigate('ProfilePage');
  };

  const renderProductCard = (product: Product) => (
    <Animated.View key={product.id} style={[styles.productCard, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={() => Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start()}
        onPress={() => navigation.navigate('StorePage')}
        style={styles.cardTouchable}
      >
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{product.name}</Text>
          <Text style={styles.priceText}>Rs {product.unitPrice.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Ecolife</Text>
        <TouchableOpacity onPress={navigateToProfilePage} style={styles.profileIcon}>
          <Icon name="user-circle" size={28} color="#4b5563" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          placeholderTextColor="#9ca3af"
        />
      </View>

      <Text style={styles.sectionTitle}>Explore Products</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading products...</Text>
        ) : products.length > 0 ? (
          products.slice(-5).map(renderProductCard)
        ) : (
          <Text style={styles.noProductsText}>No products found.</Text>
        )}
        <TouchableOpacity style={[styles.productCard, styles.exploreMoreCard]} onPress={navigateToStorePage}>
          <Icon name="arrow-right" size={24} color="#4b5563" />
          <Text style={styles.moreCardText}>Explore More</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileIcon: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#374151',
  },
  scrollViewContent: {
    paddingRight: 16,
  },
  productCard: {
    width: 180,
    height: 240,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardTouchable: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  exploreMoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
  },
  moreCardText: {
    color: '#4338ca',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 16,
  },
  noProductsText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 16,
  },
});

export default HomeUs;