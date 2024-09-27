import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../../firebaseConfig'; // Adjust the path to your firebase config
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// Remove the import for react-native-html-to-pdf
// import RNHTMLtoPDF from 'react-native-html-to-pdf';

interface Schedule {
  id: string;
  name: string;
  pickupDate: string;
  garbageTypes: string;
  pickupTime: string;
  weight?: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

const BulkSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'wasteSchedules'));
        const fetchedSchedules = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Schedule[];
        setSchedules(fetchedSchedules);
      } catch (error) {
        console.error('Error fetching bulk schedules: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Updated function to handle report generation
  const generateReport = async () => {
    let schedulesReport = `
      <h1 style="text-align: center; color: #10b981;">Bulk Schedules Report</h1>
      <div style="margin: 20px; font-family: Arial, sans-serif;">
    `;
  
    schedules.forEach((schedule) => {
      schedulesReport += `
        <div style="border: 2px solid #e5e7eb; border-radius: 10px; padding: 10px; margin-bottom: 20px;">
          <h2 style="color: #065f46;">${schedule.name}</h2>
          <p><strong>Pickup Date:</strong> ${schedule.pickupDate}</p>
          <p><strong>Garbage Types:</strong> ${schedule.garbageTypes}</p>
          <p><strong>Pickup Time:</strong> ${schedule.pickupTime}</p>
          ${schedule.weight ? `<p><strong>Weight:</strong> ${schedule.weight} kg</p>` : ''}
          <p><strong>Location:</strong> (${schedule.location.latitude}, ${schedule.location.longitude})</p>
        </div>
      `;
    });
  
    schedulesReport += `</div>`;
  
    const pdfOptions = {
      html: schedulesReport,
      fileName: 'Bulk_Schedules_Report',
      directory: 'Documents',
    };
  
    try {
      const file = await RNHTMLtoPDF.convert(pdfOptions);
      Alert.alert('PDF Generated', `PDF report has been generated at: ${file.filePath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text>Loading Bulk Schedules...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Bulk Schedules</Text>

      {/* Button to generate report */}
      <TouchableOpacity style={styles.button} onPress={generateReport}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleTitle}>{item.name}</Text>
            <Text style={styles.scheduleDate}>{item.pickupDate}</Text>
            <Text style={styles.scheduleDetails}>Garbage Types: {item.garbageTypes}</Text>
            <Text style={styles.scheduleDetails}>Pickup Time: {item.pickupTime}</Text>
            {item.weight && <Text style={styles.scheduleDetails}>Weight: {item.weight} kg</Text>}
            <Text style={styles.scheduleDetails}>Location: ({item.location.latitude}, {item.location.longitude})</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 25,
    marginVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 3,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4f46e5',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  scheduleDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  scheduleDetails: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
});

export default BulkSchedules;
