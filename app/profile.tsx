import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, TextInput, Modal } from 'react-native';
import React, { useState } from 'react';
import { router, SplashScreen, Stack, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

type Props = {}

const Profile = (props: Props) => {
  const [fontsLoaded] = useFonts({
    'Playfair': require('../assets/fonts/Playfair.ttf'),
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      } else {
        SplashScreen.preventAutoHideAsync();
      }
    }, [fontsLoaded])
  );

  const handleEditUsername = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await fetch('https://backendot.onrender.com/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Username updated successfully!');
        setModalVisible(false);
        setNewUsername('');
      } else {
        Alert.alert('Error', result.message || 'Failed to update username');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const [profileImageUri, setProfileImageUri] = useState(
    'https://media.istockphoto.com/id/610003972/vector/vector-businessman-black-silhouette-isolated.jpg?s=612x612&w=0&k=20&c=Iu6j0zFZBkswfq8VLVW8XmTLLxTLM63bfvI6uXdkacM='
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const response = await fetch('https://backendot.onrender.com/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json();
          if (response.ok) {
            setProfileImageUri(result.imageUri);
          } else {
            Alert.alert('Error', result.message || 'Failed to fetch profile image');
          }
        } catch (error) {
          Alert.alert('Error', 'An unexpected error occurred.');
        }
      };

      fetchUserProfile();
    }, [])
  );

  const handleEditProfilePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'We need access to your photo library to change the profile picture.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (pickerResult.canceled) {
        return;
      }

      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://backendot.onrender.com/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUri: pickerResult.assets[0].uri }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Profile picture updated successfully!');
        setProfileImageUri(pickerResult.assets[0].uri);
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile picture');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Error', 'Both fields are required.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://backendot.onrender.com/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Password changed successfully!');
        setPasswordModalVisible(false);
        setOldPassword('');
        setNewPassword('');
      } else {
        Alert.alert('Error', result.message || 'Failed to change password.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://backendot.onrender.com/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Account deleted successfully.');
        router.replace('/');
      } else {
        Alert.alert('Error', result.message || 'Failed to delete account.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDeleteAccount,
        },
      ]
    );
  };
  
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.content}>
          
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={handleEditProfilePicture}
        >
          <Image
            source={{
              uri: profileImageUri,
            }}
            style={styles.profileImage}
          />
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>

          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="person-outline" size={20} color={Colors.primary} />
              <Text style={styles.menuText}>Edit Username</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setPasswordModalVisible(true)}
            >
              <Ionicons name="key-outline" size={20} color={Colors.primary} />
              <Text style={styles.menuText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={confirmDelete}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              <Text style={[styles.menuText, { color: Colors.danger }]}>
                Delete Account
              </Text>
            </TouchableOpacity>

          </View>
        </View>

        <TouchableOpacity
          style={{ padding: 20 }}
          onPress={() => {
            router.replace('/dashboard');
          }}
        >
          <Ionicons name="arrow-back-outline" size={30} color={Colors.gray} />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new username"
                value={newUsername}
                onChangeText={setNewUsername}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: Colors.primary }]}
                  onPress={handleEditUsername}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: Colors.gray }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isPasswordModalVisible}
          onRequestClose={() => setPasswordModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Old Password"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: Colors.primary }]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: Colors.gray }]}
                  onPress={() => setPasswordModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changeText: {
    fontFamily: 'Playfair',
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  menu: {
    width: '100%',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: Colors.bar,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Playfair',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 16,
    color: Colors.white,
    fontFamily: 'Playfair',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontFamily: 'Playfair',
    fontSize: 14,
    color: Colors.white,
  },
});
