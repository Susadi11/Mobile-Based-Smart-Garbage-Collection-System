import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';  // Import MapView and Marker
import { collection, getDocs } from 'firebase/firestore'; // Firestore imports for fetching data
import { db } from '@/firebaseConfig'; // Ensure this path points to your firebaseConfig

import CardGrid from '@/components/vindi/CardGrid'; // Your custom CardGrid component

// Define the type for the location object
interface Location {
  id: string;
  latitude: number;
  longitude: number;
}

const ComplainDash: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]); // Set the type of the state to Location[]

  // Fetch the user locations from Firebase Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'complaints')); // Fetching the 'complaints' collection
        const locationData: Location[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            latitude: data.location.latitude,  // Ensure latitude and longitude are stored under 'location'
            longitude: data.location.longitude
          };
        });
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CardGrid />

        {/* Display the map centered on Sri Lanka */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 7.8731,  // Centered on Sri Lanka
            longitude: 80.7718,
            latitudeDelta: 2,  // Adjust for zoom level
            longitudeDelta: 2,
          }}
        >
          {/* Map through locations and place a marker for each one */}
          {locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={`Location ID: ${location.id}`}  // Optionally add more info
            />
          ))}
        </MapView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  map: {
    width: '90%',
    height: 300,  // You can adjust the height as per your design
    marginBottom: 80,
    marginTop:20,
  },
});

export default ComplainDash;
