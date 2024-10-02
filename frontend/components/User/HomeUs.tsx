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
  AddBulkWaste: undefined;
  AddNormalWaste: undefined;
  AddComplaint: undefined;
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
  const [tipIndex, setTipIndex] = useState(0); // For rotating tips
  const [fadeAnim] = useState(new Animated.Value(1)); // Animation value for tip fade in/out
  const navigation = useNavigation<HomeUsNavigationProp>();
  const firestore = getFirestore(app);

  const wasteManagementTips = [
    'Composting is a great way to reduce waste and improve soil health. Try starting a compost bin today!',
    'Reuse and recycle old materials to minimize waste in your home and community.',
    'Try using cloth bags instead of plastic when shopping to cut down on plastic waste.',
    'Donate or sell items you no longer use instead of throwing them away.',
    'Avoid buying products with excessive packaging to reduce waste generation.'
  ];

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

  // Auto-rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
      ]).start(() => {
        setTipIndex((prevIndex) => (prevIndex + 1) % wasteManagementTips.length);
      });
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const navigateToStorePage = () => {
    navigation.navigate('StorePage');
  };

  const navigateToPage = (page: keyof RootStackParamList) => {
    navigation.navigate(page);
  };

  const renderProductCard = (product: Product) => (
    <Animated.View key={product.id} style={[styles.productCard]}>
      <TouchableOpacity
        activeOpacity={0.8}
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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Ecolife</Text>
          <TouchableOpacity onPress={() => navigateToPage('ProfilePage')} style={styles.profileIcon}>
            <Icon name="user-circle" size={28} color="#4b5563" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search products..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Waste Management Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigateToPage('AddBulkWaste')}>
            <Icon name="truck" size={28} color="#4CAF50" />
            <Text style={styles.actionText}>Add Bulk Waste</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigateToPage('AddNormalWaste')}>
            <Icon name="trash" size={28} color="#4CAF50" />
            <Text style={styles.actionText}>Add Normal Waste</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigateToPage('AddComplaint')}>
            <Icon name="exclamation-circle" size={28} color="#4CAF50" />
            <Text style={styles.actionText}>Add Complaint</Text>
          </TouchableOpacity>
        </View>

        {/* Waste Management Tips Section with Dots */}
        <View style={styles.advertisement}>
          <Animated.Text style={[styles.adTitle, { opacity: fadeAnim }]}>
            Waste Management Tips
          </Animated.Text>
          <Animated.Text style={[styles.adContent, { opacity: fadeAnim }]}>
            {wasteManagementTips[tipIndex]}
          </Animated.Text>
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {wasteManagementTips.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { opacity: tipIndex === i ? 1 : 0.3 } // Highlight current dot
                ]}
              />
            ))}
          </View>
        </View>

        {/* Explore Products */}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // Ensures ScrollView takes full height
  },
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#111827',
  },
  advertisement: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 50,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  adContent: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  scrollViewContent: {
    paddingVertical: 8,
  },
  productCard: {
    width: 180,
    marginRight: 16,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTouchable: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#e5e7eb',
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  priceText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  exploreMoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreCardText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  noProductsText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default HomeUs;
