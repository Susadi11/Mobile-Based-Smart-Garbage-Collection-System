import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [currentComplaint, setCurrentComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsCollection = collection(db, 'complaints');
        const querySnapshot = await getDocs(complaintsCollection);
        const complaintsList: Complaint[] = querySnapshot.docs.map((doc) => ({
          complaintId: doc.id,
          ...(doc.data() as Omit<Complaint, 'complaintId'>),
        }));
        setComplaints(complaintsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching complaints: ', error);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleCardPress = (complaint: Complaint) => {
    setCurrentComplaint(complaint);
    setModalVisible(true);
  };

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
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
    </TouchableOpacity>
  );
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {currentComplaint && (
        <>
          <Text style={styles.progressTitle}>Complaint Progress</Text>
  
          <View style={styles.progressSteps}>
            {/* Pending Step */}
            <View style={styles.step}>
              <View
                style={[
                  styles.circle,
                  currentComplaint.status && currentComplaint.status !== 'Open'
                    ? styles.circleActive
                    : null,
                ]}
              >
                {currentComplaint.status && currentComplaint.status !== 'Open' ? (
                  <FontAwesome name="check" size={20} color="white" />
                ) : (
                  <Text style={styles.circleText}>1</Text>
                )}
              </View>
              <Text style={styles.stepLabel}>Pending</Text>
            </View>
  
            <View style={styles.line} />
  
            {/* Processing Step */}
            <View style={styles.step}>
              <View
                style={[
                  styles.circle,
                  currentComplaint.status === 'Processing' ||
                  currentComplaint.status === 'Resolved'
                    ? styles.circleActive
                    : null,
                ]}
              >
                {currentComplaint.status === 'Processing' ||
                currentComplaint.status === 'Resolved' ? (
                  <FontAwesome name="check" size={20} color="white" />
                ) : (
                  <Text style={styles.circleText}>2</Text>
                )}
              </View>
              <Text style={styles.stepLabel}>Processing</Text>
            </View>
  
            <View style={styles.line} />

            
  
            {/* Resolved Step */}
            <View style={styles.step}>
              <View
                style={[
                  styles.circle,
                  currentComplaint.status === 'Resolved'
                    ? styles.circleActive
                    : null,
                ]}
              >
                {currentComplaint.status === 'Resolved' ? (
                  <FontAwesome name="check" size={20} color="white" />
                ) : (
                  <Text style={styles.circleText}>3</Text>
                )}
              </View>
              <Text style={styles.stepLabel}>Resolved</Text>
            </View>
          </View>
  
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
  
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>

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
            onPress={() => navigation.navigate('AddComplaint')}
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

      {/* Modal for progress bar */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {renderProgressBar()}
        </View>
      </Modal>
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
    height: 90,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 50,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 25,
    color: 'white',
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
    fontWeight: 'bold',
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
    color: 'black',
  },
  complaintProblem: {
    fontSize: 14,
    marginBottom: 10,
  },
  complaintStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
   
  },
  statusOpen: {
    color: '#FFA500',
  },
  statusInProgress: {
    color: '#1E90FF',
  },
  statusResolved: {
    color: '#4CAF50',
  },
  progressContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  problemDetails: {
    marginBottom: 10,
    fontSize: 16,
    
    textAlign: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  step: {
    alignItems: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: '#4CAF50',
  },
  circleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  line: {
    width: 30,
    height: 2,
    backgroundColor: '#4CAF50',
    alignSelf: 'center',
  },
  
});

export default ComplainDash;
