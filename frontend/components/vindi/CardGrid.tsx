import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

// Define the card component inside the same file for simplicity
const CardComponent: React.FC<{ title: string; iconName: string; onPress: () => void }> = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Icon name={iconName} size={50} color="#4caf50" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

// Main component that includes the grid layout and cards
const CardGrid: React.FC = () => {
  const handlePress = (cardTitle: string) => {
    console.log(`${cardTitle} card pressed`);
    // Handle card press (e.g., navigation or update state)
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CardComponent
          title="All Complaints"
          iconName="list-alt"
          onPress={() => handlePress("All Complaints")}
        />
        <CardComponent
          title="Pending Complaints"
          iconName="clock-o"
          onPress={() => handlePress("Pending Complaints")}
        />
      </View>
      <View style={styles.row}>
        <CardComponent
          title="Resolved Complaints"
          iconName="check"
          onPress={() => handlePress("Resolved Complaints")}
        />
        <CardComponent
          title="Processing Complaints"
          iconName="spinner"
          onPress={() => handlePress("Processing Complaints")}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    margin: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: "45%",
    padding: 10,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CardGrid;
