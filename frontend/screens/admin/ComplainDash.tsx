import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import CardGrid from '@/components/vindi/CardGrid';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface Location {
  id: string;
  firstName: string;
  latitude: number;
  longitude: number;
  problem: string;
  status: string;
}

const ComplainDash: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null); // For modal
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'complaints'));
        const locationData: Location[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            firstName: data.firstName || 'Unknown',
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            problem: data.problem || 'Unknown',
            status: data.status || 'Unknown',
          };
        });
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleMarkerPress = (location: Location) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLocation(null);
  };

  const generateReport = async () => {
    const htmlContent = `
      <h1>Complaint Report</h1>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Problem</th>
          <th>Status</th>
        </tr>
        ${locations.map(location => `
          <tr>
            <td>${location.id}</td>
            <td>${location.firstName}</td>
            <td>${location.latitude}</td>
            <td>${location.longitude}</td>
            <td>${location.problem}</td>
            <td>${location.status}</td>
          </tr>
        `).join('')}
      </table>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const fileUri = `${FileSystem.documentDirectory}ComplaintReport.pdf`;

      // Move the generated file to a proper location if necessary
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate the report");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CardGrid />
        <TouchableOpacity onPress={generateReport} style={styles.statusButton}>
          <Text style={styles.statusButtonText}>Generate Report</Text>
        </TouchableOpacity>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 7.8731,
            longitude: 80.7718,
            latitudeDelta: 2,
            longitudeDelta: 2,
          }}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={`Location ID: ${location.id}`}
              description={`Status: ${location.status}`}
              onPress={() => handleMarkerPress(location)} // Trigger the modal on marker press
            />
          ))}
        </MapView>

        {/* Modal for displaying location details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedLocation && (
                <>
                  <Text style={styles.modalTitle}>Complaint Details</Text>
                  <Text>ID: {selectedLocation.id}</Text>
                  <Text>Name: {selectedLocation.firstName}</Text>
                  <Text>Latitude: {selectedLocation.latitude}</Text>
                  <Text>Longitude: {selectedLocation.longitude}</Text>
                  <Text>Problem: {selectedLocation.problem}</Text>
                  <Text>Status: {selectedLocation.status}</Text>

                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
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
    padding: 10,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    marginTop: 20,
  },
  statusButton: {

    paddingVertical: 5,
    paddingHorizontal: 7,
    backgroundColor: "#4caf50",
    borderRadius: 20,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 20,
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ComplainDash;
