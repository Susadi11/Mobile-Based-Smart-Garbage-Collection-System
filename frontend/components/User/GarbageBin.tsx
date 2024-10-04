import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const Dustbin = () => {
  const [garbageLevel, setGarbageLevel] = useState(0); // Default garbage level
  const totalHeight = 200; // Total height of the dustbin in pixels

  // Fetch garbage level from Firebase Realtime Database
  useEffect(() => {
    const db = getDatabase();
    const garbageRef = ref(db, 'dustbins/dustbin1/level'); // Adjust the path to match your Firebase structure

    onValue(garbageRef, (snapshot) => {
      const level = snapshot.val();
      setGarbageLevel(level);
    });
  }, []);

  // Calculate the height of the garbage inside the bin based on the level
  const garbageHeight = (garbageLevel / 100) * totalHeight;

  // Function to determine bin status (Empty, Partially Filled, Full)
  const getBinStatus = () => {
    if (garbageLevel >= 80) {
      return 'Bin is Full';
    } else if (garbageLevel > 20) {
      return 'Bin is Partially Filled';
    } else {
      return 'Bin is Empty';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garbage Monitoring System</Text>
      <View style={styles.binContainer}>
        {/* Dustbin */}
        <View style={styles.dustbin}>
          {/* Garbage fill */}
          <View style={[styles.garbage, { height: garbageHeight }]} />
        </View>
        {/* Text next to the bin */}
        <View style={styles.infoContainer}>
          <Text style={styles.levelText}>Garbage Level: {garbageLevel}%</Text>
          <Text style={styles.statusText}>{getBinStatus()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    margin: 15,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  binContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dustbin: {
    width: 100,
    height: 200, // Total height of the dustbin
    borderWidth: 2,
    borderColor: 'black',
    position: 'relative',
    backgroundColor: '#f0f0f0', // Background of the dustbin (empty part)
  },
  garbage: {
    width: '100%',
    backgroundColor: '#4caf50', // Green to represent garbage
    position: 'absolute',
    bottom: 0, // Start filling from the bottom
  },
  infoContainer: {
    marginLeft: 20, // Spacing between the dustbin and the text
  },
  levelText: {
    fontSize: 16,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f', // Red color for the status text
  },
});

export default Dustbin;
