// ComplaintCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

interface Complaint {
  complaintId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  location: string;
  problem: string;
  status: string; // New field for complaint status
}

interface ComplaintCardProps {
  complaint: Complaint;
  onPress: (complaint: Complaint) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(complaint)}>
      <View style={styles.card}>
        <Text style={styles.title}>Complaint ID: {complaint.complaintId}</Text>
        <Text style={styles.text}>Problem: {complaint.problem}</Text>
        <Text style={styles.text}>Status: {complaint.status}</Text>
        <Icon name="chevron-right" size={20} color="#666" style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: "row",
    alignItems: "center",
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
  icon: {
    marginLeft: 'auto',
  },
});

export default ComplaintCard;
