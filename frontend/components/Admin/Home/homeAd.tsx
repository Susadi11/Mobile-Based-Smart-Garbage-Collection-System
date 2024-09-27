import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  BulkSchedules: undefined;
  // Add other screens here
};

const HomeAd = () => {
  const [activeDot, setActiveDot] = useState<number>(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
      <Text style={styles.pageTitle}>Dashboard</Text>

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
          onPress={() => navigation.navigate('BulkSchedules')}
        >
          <Text style={styles.title}>Bulk Schedules</Text>
          <Text style={styles.description}>View all bulk schedules</Text>
        </TouchableOpacity>

        {/* Card 3 */}
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.title}>Normal Schedules</Text>
          <Text style={styles.description}>This is the description for Card 3.</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Card 4 */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150/FF33A1/FFFFFF?text=Card+4' }}
          style={styles.image}
        />
        <Text style={styles.title}>Card Title 4</Text>
        <Text style={styles.description}>This is the description for Card 4.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      {/* Card 5 */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=Card+5' }}
          style={styles.image}
        />
        <Text style={styles.title}>Card Title 5</Text>
        <Text style={styles.description}>This is the description for Card 5.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      {/* Card 6 */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150/4B0082/FFFFFF?text=Card+6' }}
          style={styles.image}
        />
        <Text style={styles.title}>Card Title 6</Text>
        <Text style={styles.description}>This is the description for Card 6.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  barChartContainer: {
    marginTop: 20,
  },
  barChartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  barChartSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // To ensure cards are spaced evenly
    marginBottom: 16,
  },
  halfCard: {
    flex: 0.48, // Adjust this value to control the width of each card
  },
  
});

export default HomeAd;