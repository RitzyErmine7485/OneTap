import { StyleSheet, Text, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SplashScreen, Stack } from 'expo-router';
import Header from '@/components/Header';
import { useFonts } from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import * as Permissions from 'expo-permissions';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Upload = () => {
  const [fontsLoaded] = useFonts({
    'Playfair': require('../assets/fonts/Playfair.ttf'),
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUploadedFiles = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const response = await axios.get('https://backendot.onrender.com/get-data', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          const fileNames = response.data.map((file: any) => file.file_name);
          setUploadedFiles(fileNames);
        } catch (error) {
          console.error('Error fetching uploaded files:', error);
        }
      };

      fetchUploadedFiles();
    }, [])
  );

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    } else {
      SplashScreen.preventAutoHideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
      });
  
      if (result) {
        const formData = new FormData();
        formData.append('file', {
          uri: result.uri,
          name: result.name,
          type: 'text/csv',
        });
  
        const token = await AsyncStorage.getItem('authToken');
  
        if (token) {
          const response = await axios.post('https://backendot.onrender.com/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 200) {
            Alert.alert('Success', 'File uploaded successfully');
            setUploadedFiles((prevFiles) => [...prevFiles, result.name.replace('.csv', '')]);
          }
        } else {
          Alert.alert('Error', 'User not authenticated');
        }
      } else {
        console.log('File selection cancelled');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'File upload failed');
    }
  };

  const renderFileItem = ({ item }: { item: string }) => (
    <View style={styles.fileItem}>
      <Ionicons name="file-tray-stacked-outline" size={24} color={Colors.primary} />
      <Text style={styles.fileName}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        header: () => <Header />,
      }} />

      <View style={styles.container}>
        <Text style={styles.title}>Upload CSV File</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={24} color={Colors.white} />
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
        <Text style={styles.historyTitle}>Uploaded Files</Text>
        <FlatList
          data={uploadedFiles}
          keyExtractor={(item) => item}
          renderItem={renderFileItem}
        />
      </View>
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Playfair',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginVertical: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    gap: 10,
    marginBottom: 20,
  },
  uploadText: {
    fontFamily: 'Playfair',
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  historyTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  fileName: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.gray,
  },
});
