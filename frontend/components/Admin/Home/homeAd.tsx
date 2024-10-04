import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig'; // Adjust the path as needed
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Home: undefined;
  BulkSchedules: undefined;
  NormalSchedules: undefined;
  AllComplaints: undefined;
  Analytics: undefined;
  ProfilePage: undefined;
  // Add other screens here
};

const HomeAd = () => {
  const [activeDot, setActiveDot] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [pendingComplaints, setPendingComplaints] = useState<number>(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(firestore, 'orders'));
        setTotalOrders(ordersSnapshot.size);

        const complaintsQuery = query(collection(firestore, 'complaints'), where('status', '==', 'Pending'));
        const complaintsSnapshot = await getDocs(complaintsQuery);
        setPendingComplaints(complaintsSnapshot.size);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [12, 19, 3, 5],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
      },
    ],
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        data: [112, 10, 225, 134, 101, 80, 50, 100, 200],
      },
    ],
  };

  const goToDot = (index: number) => {
    setActiveDot(index);
  };

  const nextDot = () => {
    setActiveDot((prev) => (prev + 1) % 4);
  };

  const prevDot = () => {
    setActiveDot((prev) => (prev - 1 + 4) % 4);
  };

  const renderChart = () => {
    if (activeDot === 2) {
      return (
        <View style={styles.barChartContainer}>
          <Text style={styles.barChartSubtitle}>Monthly Average</Text>
          <BarChart
            data={barData}
            width={320}
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.5,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      );
    } else {
      return (
        <LineChart
          data={lineData}
          width={320}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
          <Text style={styles.pageTitle}>Dashboard</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')} style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={30} color="black" /> 
        </TouchableOpacity>
        </View>

      {/* Card 1 with Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {activeDot === 2 ? 'Product Sales' : 'Sales Overview'}
        </Text>
        
        {renderChart()}

        {/* Navigation Dots and Arrows */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={prevDot} style={styles.arrowButton}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.dotContainer}>
            {Array(4).fill(null).map((_, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => goToDot(index)}
                style={[
                  styles.dot,
                  { backgroundColor: activeDot === index ? '#007BFF' : '#ccc' },
                ]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={nextDot} style={styles.arrowButton}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        {/* Card 2 (Bulk Schedules) */}
        <TouchableOpacity
          style={[styles.card, styles.halfCard]}
          onPress={() => navigation.navigate('BulkSchedules')}>
          <Icon name="truck" size={40} color="#007BFF" style={styles.cardIcon} />
          <Text style={styles.title}>Bulk Schedules</Text>
          <Text style={styles.description}>View all bulk schedules</Text>
        </TouchableOpacity>

        {/* Card 3 (Normal Schedules) */}
        <TouchableOpacity
          style={[styles.card, styles.halfCard]}
          onPress={() => navigation.navigate('NormalSchedules')}>
          <Icon name="calendar-check" size={40} color="#28a745" style={styles.cardIcon} />
          <Text style={styles.title}>Normal Schedules</Text>
          <Text style={styles.description}>View all normal schedules</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {/* Card 4 (Total Orders) */}
        <View style={[styles.card, styles.halfCard]}>
          <Icon name="shopping" size={40} color="#ffc107" style={styles.cardIcon} />
          <Text style={styles.title}>Total Orders</Text>
          <Text style={styles.orderCount}>{totalOrders}</Text>
          <Text style={styles.description}>Total number of orders placed</Text>
        </View>

        {/* Card 6 (Pending Complaints) - New Card */}
        <TouchableOpacity
          style={[styles.card, styles.halfCard]}
          onPress={() => navigation.navigate('AllComplaints')}>
          <Icon name="alert-circle" size={40} color="#dc3545" style={styles.cardIcon} />
          <Text style={styles.title}>Pending Complaints</Text>
          <Text style={styles.orderCount}>{pendingComplaints}</Text>
          <Text style={styles.description}>Complaints awaiting resolution</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    width: '100%',
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#343a40',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#343a40',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  arrowButton: {
    paddingHorizontal: 12,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  barChartContainer: {
    marginTop: 20,
  },
  barChartSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfCard: {
    flex: 0.48,
  },
  cardIcon: {
    marginBottom: 12,
  },
  orderCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 8,
  },
  profileIcon: {
    padding: 8,
  },
});

export default HomeAd;