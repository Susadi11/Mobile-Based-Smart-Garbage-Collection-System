import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
};

type ProfilePageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: ProfilePageNavigationProp;
};

const ProfilePage: React.FC<Props> = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [user, setUser] = useState<any>(null);

  // Fetch the current user data from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null); // User is logged out
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePasswordReset = () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    // Implement password reset logic here
    Alert.alert('Success', 'Password has been reset');
    setNewPassword('');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login'); // Navigate to login screen after logout
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user logged in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => console.log('Back pressed')}>
          <Icon name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.photoContainer}>
        <Image
            source={user.photoURL ? { uri: user.photoURL } : require('../assets/images/man.png')} // Load local image if user doesn't have a photo
          style={styles.profilePhoto}/>

          <TouchableOpacity style={styles.editPhotoButton}>
            <Icon name="camera" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.info}>{user.displayName || 'No name provided'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.info}>{user.email}</Text>
        </View>

        <View style={styles.passwordResetContainer}>
          <Text style={styles.label}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb', // ash background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6', // light ash background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937', // dark gray for text
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
    borderColor: '#4CAF50', // green border for profile photo
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50', // green for the camera button
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
    borderBottomColor: '#e5e7eb', // light ash border
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563', // darker ash for labels
  },
  info: {
    fontSize: 16,
    color: '#1f2937', // dark gray for info text
  },
  passwordResetContainer: {
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // light ash border for input
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb', // ash background for input
    marginVertical: 8,
  },
  resetButton: {
    backgroundColor: '#4CAF50', // green for reset button
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
  logoutButton: {
    backgroundColor: '#ef4444', // red for logout button
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfilePage;
