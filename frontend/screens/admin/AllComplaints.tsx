import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, TextInput } from "react-native";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore"; // Firestore functions
import { db } from "@/firebaseConfig";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

interface Complaint {
  complaintId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  location: {
    latitude: number; // Define latitude as a number
    longitude: number; // Define longitude as a number
  };
  problem: string;
  date: string; // Add date field
  time: string; // Add time field
  status: string; // Field for complaint status
}

const AllComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null); // Track selected complaint
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsCollection = collection(db, "complaints");
        const querySnapshot = await getDocs(complaintsCollection);

        const complaintsList: Complaint[] = querySnapshot.docs.map((doc) => ({
          complaintId: doc.id,
          ...doc.data(),
        })) as Complaint[];

        setComplaints(complaintsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints: ", error);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Handle status change and update Firestore
  const handleStatusChange = async (status: string) => {
    if (selectedComplaint) {
      const complaintRef = doc(db, "complaints", selectedComplaint.complaintId); // Reference to the specific complaint
      try {
        // Update the status in Firestore
        await updateDoc(complaintRef, {
          status: status,
        });

        // Update the status locally
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint.complaintId === selectedComplaint.complaintId
              ? { ...complaint, status }
              : complaint
          )
        );
        setSelectedComplaint({ ...selectedComplaint, status });
      } catch (error) {
        console.error("Error updating status: ", error);
      }
    }
  };

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.complaintId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <TouchableOpacity onPress={() => setSelectedComplaint(item)}>
      <View style={styles.card}>
        {/* Add the icon here */}
        <Icon name="book" size={13} color="#ff6347" style={styles.cardIcon} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>Complaint ID: {item.complaintId}</Text>
          <Text style={styles.text}>Problem: {item.problem}</Text>
          <Text style={styles.statusText}>Status: {item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaints</Text>
      </View>

      <View style={styles.complaintCountContainer}>
        <Icon name="list-alt" size={30} color="#4caf50" />
        <Text style={styles.complaintCountText}>Total Complaints: {complaints.length}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Complaint ID"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredComplaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item.complaintId}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for displaying complaint details and updating status */}
      {selectedComplaint && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedComplaint}
          onRequestClose={() => setSelectedComplaint(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Complaint Details</Text>
              <Text style={styles.modalText}>Complaint ID: {selectedComplaint.complaintId}</Text>
              <Text style={styles.modalText}>First Name: {selectedComplaint.firstName}</Text>
              <Text style={styles.modalText}>Last Name: {selectedComplaint.lastName}</Text>
              <Text style={styles.modalText}>Mobile Number: {selectedComplaint.mobileNumber}</Text>
              <Text style={styles.modalText}>Email: {selectedComplaint.email}</Text>

              {/* Format and display location */}
              <Text style={styles.modalText}>
                Location: Latitude: {selectedComplaint.location.latitude}, Longitude: {selectedComplaint.location.longitude}
              </Text>

              {/* Format and display date and time */}
              <Text style={styles.modalText}>Date: {new Date(selectedComplaint.date).toLocaleDateString()}</Text>
              <Text style={styles.modalText}>Time: {selectedComplaint.time}</Text>
              <Text style={styles.modalText}>Problem: {selectedComplaint.problem}</Text>
              <Text style={styles.modalText}>Status: {selectedComplaint.status}</Text>

              <View style={styles.statusOptions}>
                <TouchableOpacity onPress={() => handleStatusChange("Pending")} style={styles.statusButton}>
                  <Text style={styles.statusButtonText}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusChange("Processing")} style={styles.statusButton}>
                  <Text style={styles.statusButtonText}>Processing</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusChange("Resolved")} style={styles.statusButton}>
                  <Text style={styles.statusButtonText}>Resolved</Text>
                </TouchableOpacity>
              </View>

              <Button title="Close" onPress={() => setSelectedComplaint(null)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  headerTitle: {
    fontSize: 25,
    color: 'black',
    fontWeight:'bold',
  },
  complaintCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  complaintCountText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#4caf50",
  },
  listContainer: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  card: {
    flexDirection: "row", // Ensures the icon and text are side-by-side
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 15,
    
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  statusText: {
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
   
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
   
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight:'bold',
    
  },
  statusOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#4caf50",
    borderRadius: 5,
    width:88,
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AllComplaints;
