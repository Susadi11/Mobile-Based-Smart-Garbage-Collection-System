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
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => console.log('Back pressed')}>
          <Icon name="arrow-left" size={24} color={isDarkMode ? '#e5e7eb' : '#1f2937'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Profile</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with the actual user photo URL
            style={styles.profilePhoto}
          />
          <TouchableOpacity style={styles.editPhotoButton}>
            <Icon name="camera" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>Name</Text>
          <Text style={[styles.info, isDarkMode && styles.darkText]}>John Doe</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>Email</Text>
          <Text style={[styles.info, isDarkMode && styles.darkText]}>johndoe@example.com</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
            thumbColor={isDarkMode ? "#f3f4f6" : "#ffffff"}
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>

        <View style={styles.passwordResetContainer}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>Reset Password</Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Enter new password"
            placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  darkContainer: {
    backgroundColor: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#3b82f6',
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  info: {
    fontSize: 16,
    color: '#1f2937',
  },
  passwordResetContainer: {
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    marginVertical: 8,
  },
  resetButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  darkText: {
    color: '#e5e7eb',
  },
  darkInput: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#e5e7eb',
  },
});

export default ProfilePage;