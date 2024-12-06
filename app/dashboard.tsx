import { StyleSheet, Text, TouchableOpacity, View, FlatList, ScrollView, Image, Alert } from 'react-native';
import { router, SplashScreen, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

type Props = {}

const Dashboard = (props: Props) => { 
  const [fontsLoaded] = useFonts({
    'Playfair': require('../assets/fonts/Playfair.ttf'),
  });

  const [profile, setProfile] = useState({
    username: 'User',
    email: 'user@email.com',
    imageUri: 'https://media.istockphoto.com/id/610003972/vector/vector-businessman-black-silhouette-isolated.jpg?s=612x612&w=0&k=20&c=Iu6j0zFZBkswfq8VLVW8XmTLLxTLM63bfvI6uXdkacM=',
  });

  const [recentFiles, setRecentFiles] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      } else {
        SplashScreen.preventAutoHideAsync();
      }

      fetchProfile();
      fetchFilesData();
    }, [fontsLoaded])
  );

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        router.replace('/signin');
        return;
      }

      const response = await axios.get('https://backendot.onrender.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        const { username, email, imageUri } = response.data;
        setProfile({
          username: username,
          email: email,
          imageUri: imageUri,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile data. Please try again later.');
      console.error(error);
    }
  };

  const fetchFilesData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        router.replace('/signin');
        return;
      }
  
      const response = await axios.get('https://backendot.onrender.com/get-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.length > 0 && response.data[0].message === "No data yet") {
        setRecentFiles([]);
        setQuickActions([]);
      } else if (response.data) {
        const sortedFiles = response.data
          .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
          .slice(0, 5);
  
        setRecentFiles(sortedFiles);
  
        const recentFiles = response.data.slice(0, 5);
        setQuickActions(recentFiles);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch recent files. Please try again later.');
      console.error(error);
    }
  };
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{
        header: () => <Header />, 
      }} />

      <View style={styles.container}>
        
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { router.replace('/profile') }}>
            <Text style={styles.sectionTitle}>
              <Ionicons name='finger-print-outline' style={{ color: Colors.primary }} size={16} /> Profile Info
            </Text>
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: profile.imageUri }} 
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileText}>{profile.username}</Text>
              <Text style={styles.profileText}>{profile.email}</Text>
            </View>
          </View>
        </View>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {quickActions.length > 0 ? (
              quickActions.map((file, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.carouselButton} 
                  
                >
                  <Ionicons name="albums-outline" size={30} color={Colors.primary} />
                  <Text style={styles.buttonText}>{file.file_name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No data uploaded</Text>
            )}
          </ScrollView>
        </View>

        <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Recent CSV Files</Text>
          {recentFiles.length > 0 ? (
            <FlatList
              data={recentFiles}
              keyExtractor={(item) => item.upload_date}
              renderItem={({ item }) => (
                <View style={styles.fileItem}>
                  <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
                  <Text style={styles.fileName}>
                    {item.file_name} - {formatDate(item.upload_date)}
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noDataText}>No recent files uploaded</Text>
          )}
        </View>
      </View>
    </>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  profileImage: {
    height: 75,
    width: 75,
    borderRadius: 30,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.bar,
    borderRadius: 8,
    justifyContent: 'space-evenly',
    flexShrink: 1,
  },
  profileText: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 5,
  },
  carousel: {
    flexDirection: 'row',
  },
  carouselButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bar,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    width: 200,
    height: 200,
  },
  buttonText: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: Colors.primary,
    marginTop: 5,
    textAlign: 'center',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fileName: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.gray,
    marginLeft: 8,
  },
  noDataText: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 10,
  }
});
