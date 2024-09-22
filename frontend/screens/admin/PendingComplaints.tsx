import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig"; 
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

interface Complaint {
  complaintId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  location: string;
  problem: string;
  status: string;
}

const PendingComplaints: React.FC = () => {
  const [pendingComplaints, setPendingComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPendingComplaints = async () => {
      try {
        const complaintsCollection = collection(db, "complaints");
        const q = query(complaintsCollection, where("status", "==", "Pending"));
        const querySnapshot = await getDocs(q);

        const complaintsList: Complaint[] = querySnapshot.docs.map((doc) => ({
          complaintId: doc.id,
          ...doc.data(),
        })) as Complaint[];

        setPendingComplaints(complaintsList);
        setFilteredComplaints(complaintsList);
      } catch (error) {
        console.error("Error fetching pending complaints: ", error);
      }
    };

    fetchPendingComplaints();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filteredData = pendingComplaints.filter(
      (complaint) =>
        complaint.problem.toLowerCase().includes(text.toLowerCase()) ||
        complaint.location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredComplaints(filteredData);
  };

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>Complaint ID: {item.complaintId}</Text>
        <Text style={styles.text}>Problem: {item.problem}</Text>
        <Text style={styles.text}>Location: {item.location}</Text>
        <Text style={styles.text}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
         <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Complaints</Text>
      </View>
      {/* Complaints Count */}
      <View style={styles.complaintCountContainer}>
        <Icon name="list-alt" size={30} color="#4caf50" />
      <Text style={styles.complaintCountText}>Total Complaints ({filteredComplaints.length})</Text>
      </View>

      {/* Search Bar */}
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Complaint ID"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Complaints List */}
      <FlatList
        data={filteredComplaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item.complaintId}
      />
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
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: '#fff', // white background for the search bar
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff', // white background for cards
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd', // light border color
    elevation: 3, // slight shadow for the card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width:'90%',
    marginLeft:20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff', // blue color for titles
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#555', // grey color for text
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
});

export default PendingComplaints;
