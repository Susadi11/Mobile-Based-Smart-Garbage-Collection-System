import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore'; // Firestore imports for fetching data
import { db } from '@/firebaseConfig'; // Ensure this path points to your firebaseConfig

interface Location {
  id: string;
  latitude: number;
  longitude: number;
}

const ListNavbar: React.FC = () => {
  const [showMap, setShowMap] = useState(false); // State to show/hide the map modal
  const [locations, setLocations] = useState<Location[]>([]); // State to hold fetched locations

  // Function to toggle the map modal
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Fetch the user locations from Firebase Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'complaints')); // Fetching the 'complaints' collection
        const locationData: Location[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            latitude: data.location.latitude, // Ensure latitude and longitude are stored under 'location'
            longitude: data.location.longitude,
          };
        });
        setLocations(locationData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <View>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Map Icon */}
        <TouchableOpacity style={styles.navItem} onPress={toggleMap}>
          <Icon name="map" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Modal for Map Popup */}
      <Modal
        visible={showMap}
        animationType="slide"
        transparent={false}
        onRequestClose={toggleMap}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleMap}>
            <Icon name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
          
          {/* Map View */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 7.8731, // Centered on Sri Lanka
              longitude: 80.7718,
              latitudeDelta: 2,
              longitudeDelta: 2,
            }}
          >
            {/* Map through locations and place a marker for each one */}
            {locations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title={`Location ID: ${location.id}`} // Optionally add more info
              />
            ))}
          </MapView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    height: 55,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 300,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    
  },
  map: {
    width: '100%',
    height: 700,
    marginBottom: 80,
    marginTop: 60,
  },
});

export default ListNavbar;
