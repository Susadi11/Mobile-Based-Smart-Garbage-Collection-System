import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebaseConfig'; // Adjust your Firebase config import path


// Define a type for the dustbin data
type DustbinData = {
  userId: string;
  binDepth: number;
  garbageLevel: number;
  distance: number;
  timestamp: string;
};

const Dustbin: React.FC = () => {
  const [dustbinData, setDustbinData] = useState<DustbinData[]>([]); // Explicitly set type for state

  // Fetch garbage data from Firebase Realtime Database
  useEffect(() => {
    const usersRef = ref(database, 'UsersData'); // Reference to the 'UsersData' node

    // Listen for changes in the 'UsersData' node
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val(); // Get the data snapshot
      const fetchedData: DustbinData[] = []; // Explicitly define the array type

      // Loop through each user in 'UsersData'
      if (data) {
        Object.keys(data).forEach((userId) => {
          const userReadings = data[userId]?.readings;
          console.log('User Readings:', userReadings); // Log all readings for this user

          if (userReadings) {
            // Get only keys that are valid timestamps
            const readingKeys = Object.keys(userReadings).filter((key) =>
              /^\d+$/.test(key) // Ensure it's a number (i.e., valid timestamp)
            );
            const latestReadingKey = readingKeys.length ? readingKeys.pop() : null; // Ensure the key exists

            if (latestReadingKey) {
              const latestReading = userReadings[latestReadingKey];

              // Log the latest reading key and data
              console.log('Latest Reading Key:', latestReadingKey);
              console.log('Latest Reading Data:', latestReading);

              if (latestReading && typeof latestReading === 'object') {
                // Push the fetched data to the array
                fetchedData.push({
                  userId,
                  binDepth: parseFloat(latestReading.binDepth) || 0, // Ensure numeric value
                  garbageLevel: parseFloat(latestReading.garbageLevel) || 0, // Ensure numeric value
                  distance: parseFloat(latestReading.distance) || 0, // Ensure numeric value
                  timestamp: latestReading.timestamp || '',
                });

                // Log the parsed values for further debugging
                console.log('Parsed Bin Depth:', latestReading.binDepth);
                console.log('Parsed Garbage Level:', latestReading.garbageLevel);
              } else {
                console.log('Unexpected data structure for latestReading:', latestReading);
              }
            }
          }
        });
      }

      setDustbinData(fetchedData); // Update the state with the latest readings
    });
  }, []);

  // Constant bin height for visualization
  const totalHeight = 200; // in pixels

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart GarbageBins</Text>

      {/* Render the dustbin data for each user */}
      {dustbinData.map((item, index) => {
        const garbageHeight =
          item.binDepth > 0
            ? (item.garbageLevel / item.binDepth) * totalHeight
            : 0; // Fallback in case of invalid data

        return (
          <View key={index} style={styles.binContainer}>
            {/* User ID is now positioned above the bin */}
            <Text style={styles.userIdText}>User ID: {item.userId}</Text>
            <View style={styles.dustbinContainer}>
              <View style={styles.binLid} />
              <View style={styles.dustbin}>
                {/* Garbage fill */}
                <View style={[styles.garbage, { height: garbageHeight }]} />
              </View>
            </View>
            {/* Information next to the bin */}
            <View style={styles.infoContainer}>
              <Text style={styles.levelText}>Garbage Level: {item.garbageLevel} cm</Text>
              <Text style={styles.levelText}>Bin Depth: {item.binDepth} cm</Text>
              <Text style={styles.levelText}>Distance: {item.distance} cm</Text>
              <Text style={styles.levelText}>Timestamp: {item.timestamp}</Text>
            </View>
          </View>
        );
      })}
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
    alignItems: 'center', // Align everything center vertically
    marginBottom: 20,
    justifyContent: 'center', // Center align items within
  },
  dustbinContainer: {
    alignItems: 'center', // Center the bin and lid
  },
  userIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5, // Add some space between userId and the bin
    color: '#333', // Darker color for better visibility
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
