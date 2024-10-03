import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListNavbar from '@/components/vindi/ListNavBar';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Adjust this import based on your Firebase setup
import { FontAwesome } from '@expo/vector-icons'; // For icons, you can install expo icons

type RootStackParamList = {
  ComplainDash: undefined;
  AddComplaint: undefined;
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
      <View style={styles.cardHeader}>
        <FontAwesome name="info-circle" size={24} color="#007BFF" style={styles.icon} />
        <Text style={styles.complaintId}>Complaint ID: {item.complaintId}</Text>
      </View>
      <Text style={styles.complaintProblem}>Problem: {item.problem}</Text>
      <Text
        style={[
          styles.complaintStatus,
          item.status === 'Open' ? styles.statusOpen :
          item.status === 'In Progress' ? styles.statusInProgress : styles.statusResolved,
        ]}
      >
        {item.status}
      </Text>
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
  mainContent: {
    flex: 1,
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
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
  cardButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: 150,
    alignSelf: 'center',
   
  },
  cardButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight:'bold',
  },
  text3: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    
  },
  complaintList: {
    paddingBottom: 20,
  },
  complaintCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  complaintId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  complaintProblem: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  complaintStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusOpen: {
    backgroundColor: '#4CAF50', // Orange for "Open"
    color: 'white',
  },
  statusInProgress: {
    backgroundColor: '#1E90FF', // Blue for "In Progress"
    color: 'white',
  },
  statusResolved: {
    backgroundColor: '#1E90FF', // Green for "Resolved"
    color: 'white',
  },
});

export default ComplainDash;
