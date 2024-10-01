import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfilePage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);

  const handlePasswordReset = () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    // Implement password reset logic here
    Alert.alert('Success', 'Password has been reset');
    setNewPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.photoContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with the actual user photo URL
          style={styles.profilePhoto}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.info}>John Doe</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>johndoe@example.com</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Dark Mode:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>

      <View style={styles.passwordResetContainer}>
        <Text style={styles.label}>Reset Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb', // Tailwind's gray-100
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937', // Tailwind's gray-800
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#d1d5db', // Tailwind's gray-300
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Tailwind's gray-200
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563', // Tailwind's gray-600
  },
  info: {
    fontSize: 16,
    color: '#1f2937', // Tailwind's gray-800
  },
  passwordResetContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // Tailwind's gray-300
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9fafb', // Tailwind's gray-100
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#3b82f6', // Tailwind's blue-500
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
