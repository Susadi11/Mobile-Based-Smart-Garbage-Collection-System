import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ComplainDash: undefined;
  AllComplaints: undefined;
  ComplaintPending:undefined;
  ComplaintProcessing:undefined;
  ComplaintResolve:undefined;
  
  // Add other routes if needed
};

type CardGridNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CardComponent: React.FC<{ title: string; iconName: string; onPress: () => void }> = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Icon name={iconName} size={30} color="#4caf50" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const CardGrid: React.FC = () => {
  const navigation = useNavigation<CardGridNavigationProp>();

  const handlePress = (cardTitle: string) => {
    console.log(`${cardTitle} card pressed`);
    if (cardTitle === "All Complaints") {
      navigation.navigate('AllComplaints'); // Navigate to AllComplaints screen
    }
    console.log(`${cardTitle} card pressed`);
    if (cardTitle === "Pending Complaints") {
      navigation.navigate('ComplaintPending'); // Navigate to AllComplaints screen
    }
    console.log(`${cardTitle} card pressed`);
    if (cardTitle === "Processing Complaints") {
      navigation.navigate('ComplaintProcessing'); // Navigate to AllComplaints screen
    }
    console.log(`${cardTitle} card pressed`);
    if (cardTitle === "Resolved Complaints") {
      navigation.navigate('ComplaintResolve'); // Navigate to AllComplaints screen
    }
    // Add other navigation logic if needed
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
    flexDirection: "column",
    
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    margin: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    width: "45%",
    padding: 10,
    marginBottom:20,
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
