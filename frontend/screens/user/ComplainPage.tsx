import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListNavbar from '@/components/vindi/ListNavBar';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Adjust this import based on your Firebase setup

type RootStackParamList = {
  ComplainDash: undefined;
  AddComplaint: undefined; // Adjust if you need to pass any parameters
};

type ComplainDashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ComplainDash'>;

interface Complaint {
  complaintId: string;
  problem: string;
  status: string;
}

const ComplainDash: React.FC = () => {
  const navigation = useNavigation<ComplainDashNavigationProp>();

  

  const handleAddComplaint = () => {
    navigation.navigate('AddComplaint');
  };


  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsCollection = collection(db, "complaints");
        const querySnapshot = await getDocs(complaintsCollection);
        const complaintsList: Complaint[] = querySnapshot.docs.map((doc) => ({
          complaintId: doc.id,
          ...(doc.data() as Omit<Complaint, 'complaintId'>),
        }));
        setComplaints(complaintsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints: ", error);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <View style={styles.complaintCard}>
      <Text style={styles.complaintId}>Complaint ID: {item.complaintId}</Text>
      <Text style={styles.complaintProblem}>Problem: {item.problem}</Text>
      <Text style={styles.complaintStatus}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>
      <ListNavbar />
      <View style={styles.mainContent}>
        <View style={styles.card}>
          
          <Image
            source={{ uri: 'https://www.slnsoftwares.com/images/benefit-complaint-system.webp' }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>
            "Got a problem? Let us know by submitting your complaint. We’ll make sure it gets to the right place and help you resolve it quickly. Click 'Add Complaint' to get started."
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={handleAddComplaint} // Navigate to AddComplaint
          >
            <Text style={styles.cardButtonText}>Add Complaint</Text>
          </TouchableOpacity>
          
        </View>
        <Text style={styles.text3}>My Complaints</Text>
        {!loading ? (
          <FlatList
            data={complaints}
            renderItem={renderComplaint}
            keyExtractor={(item) => item.complaintId}
            contentContainerStyle={styles.complaintList}
          />
        ) : (
          <Text>Loading complaints...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cardButton: {
    backgroundColor: '#00A36C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width:130,
    marginLeft:100,
  },
  cardButtonText: {
    color: 'white',
    fontSize: 16,
    
  },
  text3:{
    fontSize:20,
    fontWeight:'bold',
    marginBottom:10,
    marginLeft:120,

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
    fontSize: 20,
    color: 'black',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    marginBottom: 20,
    padding: 15,
    
    
    
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  complaintList: {
    paddingBottom: 20,
  },
  complaintCard: {
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    elevation: 2,
    padding: 10,
    marginBottom: 10,
    
  },
  complaintId: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  complaintProblem: {
    fontSize: 14,
    marginBottom: 5,
  },
  complaintStatus: {
    fontSize: 14,
    color: 'red',
  },
});

export default ComplainDash;
