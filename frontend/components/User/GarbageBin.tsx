import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const Dustbin = () => {
  const [garbageLevel, setGarbageLevel] = useState(20); // Default garbage level
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
      <Text style={styles.title}>Smart Garbage Bin</Text>
      <View style={styles.binContainer}>
        {/* Dustbin with lid */}
        <View style={styles.dustbinContainer}>
          <View style={styles.binLid} />
          <View style={styles.dustbin}>
            {/* Garbage fill */}
            <View style={[styles.garbage, { height: garbageHeight }]} />
          </View>
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
    marginBottom: 25,
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
  dustbinContainer: {
    alignItems: 'center', // Center the bin and lid
  },
  binLid: {
    width: 110,
    height: 20,
    backgroundColor: '#555', // Dark color for the lid
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50, // Rounded top corners to make it look like a lid
    marginBottom: -2, // Slight overlap with the bin
  },
  dustbin: {
    width: 100,
    height: 200, // Total height of the dustbin
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#f0f0f0', // Background of the dustbin (empty part)
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20, // Slightly rounded bottom edges for a bin shape
    overflow: 'hidden', // To ensure the garbage fill doesn't overflow the bin shape
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
