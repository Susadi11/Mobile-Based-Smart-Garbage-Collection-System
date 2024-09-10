import * as React from 'react';
import { View, Text, StyleSheet,ScrollView} from 'react-native';
import MapView from 'react-native-maps';  // Import MapView
import ListNavbar from '@/components/vindi/ListNavBar';
import CardGrid from '@/components/vindi/CardGrid';

const ComplainDash: React.FC = () => {
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>
      

      <ListNavbar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.text2}>Summary of Complaints</Text>
      <CardGrid />

      <Text style={styles.text2}>Check Complaints Areas</Text>

      {/* Placeholder for the map at the bottom */}
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,  // You can adjust this to any default location
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 30,
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,

  },
  text2: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    
  },
  headerTitle: {
    fontSize: 25,
    color: 'black',
    fontWeight:'bold',


  },
  map: {
    width: '90%',
    height: 200,  // You can adjust the height as per your UI design
    marginTop: 20,
    

  },
});

export default ComplainDash;
