import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { app } from '../../../firebaseConfig'; // Adjust the path to your firebase config
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useFonts, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

type RootStackParamList = {
  NormalSchedules: undefined;
};

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
  isComplete: boolean;
}

type NormalSchedulesProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NormalSchedules'>;
};

const CustomCheckbox = ({ value, onValueChange }: { value: boolean; onValueChange: (value: boolean) => void }) => (
  <TouchableOpacity onPress={() => onValueChange(!value)}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
      {value && <Ionicons name="checkmark" size={18} color="white" />}
    </View>
  </TouchableOpacity>
);

const NormalSchedules = ({ navigation }: NormalSchedulesProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const firestore = getFirestore(app);

  let [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'wasteSchedules')); // Changed from 'normalSchedules' to 'wasteSchedules'
        const fetchedSchedules = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((schedule: any) => schedule.scheduleType === 'normal') as Schedule[]; // Filter for normal schedules
        setSchedules(fetchedSchedules);
        setFilteredSchedules(fetchedSchedules);
      } catch (error) {
        console.error('Error fetching normal schedules: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = schedules.filter((schedule) =>
      schedule.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSchedules(filtered);
  };

  const markAsComplete = async (id: string) => {
    try {
      const scheduleRef = doc(firestore, 'wasteSchedules', id); // Changed from 'normalSchedules' to 'wasteSchedules'
      await updateDoc(scheduleRef, { isComplete: true });
      const updatedSchedules = schedules.map(schedule => 
        schedule.id === id ? { ...schedule, isComplete: true } : schedule
      );
      setSchedules(updatedSchedules);
      setFilteredSchedules(updatedSchedules);
    } catch (error) {
      console.error('Error marking schedule as complete:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const generateReport = async () => {
    let tableRows = '';
    filteredSchedules.forEach((schedule) => {
      tableRows += `
        <tr>
          <td>${schedule.name}</td>
          <td>${formatDate(schedule.pickupDate)}</td>
          <td>${schedule.garbageTypes}</td>
          <td>${schedule.pickupTime}</td>
          <td>${schedule.isComplete ? 'Completed' : 'Pending'}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica'; padding: 20px; }
            h1 { text-align: center; color: #10b981; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Normal Schedules Report</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const fileName = 'NormalSchedulesReport.pdf';

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/pdf')
            .then(async (createdUri) => {
              await FileSystem.writeAsStringAsync(createdUri, base64, { encoding: FileSystem.EncodingType.Base64 });
              Alert.alert('Success', `Report downloaded to your device as ${fileName}`);
            })
            .catch((e) => {
              console.error(e);
              Alert.alert('Error', 'Failed to save the file.');
            });
        } else {
          Alert.alert('Permission denied', 'Unable to save the file without permission.');
        }
      } else {
        // For iOS and other platforms
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate and download PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text>Loading Bulk Schedules...</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Normal Schedules</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search schedules..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <TouchableOpacity style={styles.button} onPress={generateReport}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredSchedules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleTitle}>{item.name}</Text>
            <Text style={styles.scheduleDate}>{formatDate(item.pickupDate)}</Text>
            <Text style={styles.scheduleDetails}>Garbage Types: {item.garbageTypes}</Text>
            <Text style={styles.scheduleDetails}>Pickup Time: {item.pickupTime}</Text>
            {item.weight && <Text style={styles.scheduleDetails}>Weight: {item.weight} kg</Text>}
            <Text style={styles.scheduleDetails}>Location: ({item.location.latitude}, {item.location.longitude})</Text>
            <View style={styles.checkboxContainer}>
              <Text>Complete:</Text>
              <CustomCheckbox
                value={item.isComplete}
                onValueChange={() => markAsComplete(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'black',
    fontFamily: 'Inter_700Bold',
  },
  searchBar: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginBottom: 16,
    borderColor: '#d1d5db',
    borderWidth: 1,
    fontFamily: 'Inter_500Medium',
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
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#047857',
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  scheduleDate: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  scheduleDetails: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#047857',
  },
  button: {
    backgroundColor: '#047857',
    padding: 12,
    borderRadius: 25,
    marginVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
  },
  
});

export default NormalSchedules;