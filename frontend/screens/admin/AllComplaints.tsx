import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, TextInput } from "react-native";
import { getDocs, collection } from "firebase/firestore"; // Firestore functions
import { db } from "@/firebaseConfig"; // Adjust this import based on your Firebase setup
import AdminNavBar from "@/components/vindi/AdminNavBar";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

interface Complaint {
  complaintId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  location: string;
  problem: string;
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

  // Handle status change for each complaint
  const handleStatusChange = (status: string) => {
    if (selectedComplaint) {
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.complaintId === selectedComplaint.complaintId ? { ...complaint, status } : complaint
        )
      );
      setSelectedComplaint({ ...selectedComplaint, status }); // Update the selected complaint's status
    }
  };

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.complaintId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <TouchableOpacity onPress={() => setSelectedComplaint(item)}>
      <View style={styles.card}>
        <Text style={styles.title}>Complaint ID: {item.complaintId}</Text>
        <Text style={styles.text}>Problem: {item.problem}</Text>
        <Text style={styles.text1}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaints</Text>
      </View>
      <AdminNavBar />

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
              <Text style={styles.modalText}>Location: {selectedComplaint.location}</Text>
              <Text style={styles.modalText}>Problem: {selectedComplaint.problem}</Text>
              <Text style={styles.modalText}>Status: {selectedComplaint.status}</Text>

              <View style={styles.statusOptions}>
                <TouchableOpacity onPress={() => handleStatusChange("Pending")} style={styles.statusButton}>
                  <Text style={styles.statusButtonText}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusChange("Progressing")} style={styles.statusButton}>
                  <Text style={styles.statusButtonText}>Progressing</Text>
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
    fontSize: 20,
    color: "black",
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
  text1:{

    color:'red',

  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  statusOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  statusButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#4caf50",
    alignItems: "center",
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default AllComplaints;
