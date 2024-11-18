import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SplashScreen, Stack } from 'expo-router';
import Header from '@/components/Header';
import { useFonts } from 'expo-font';

type Props = {}

const Upload = (props: Props) => {
  const [fontsLoaded] = useFonts({
    'Playfair': require('../assets/fonts/Playfair.ttf'),
  });

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

  const [uploadedFiles, setUploadedFiles] = useState([
    "report_october.csv",
    "report_september.csv",
    "report_august.csv",
  ]);

  return (
    <>
      <Stack.Screen options={{
        header: () => <Header />, 
        }} />
    
      <View style={styles.container}>
        <View style= {{ bottom: 300 }}>
          <View style={styles.menu}>
            <Text style={styles.title}>Upload Files</Text>

            <TouchableOpacity style={styles.uploadButton} onPress={() => { /* necesito amor de un gótica qlona */ }}>
              <Ionicons name="cloud-upload-outline" size={24} color={Colors.white} />
              <Text style={styles.uploadText}>Upload CSV</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style= {{ bottom: 150, paddingHorizontal: 20 }}>
          <Text style={styles.historyTitle}>Upload History</Text>

          <FlatList
            data={uploadedFiles}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.fileItem}>
                <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
                <Text style={styles.fileName}>{item}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </>
    
  );
}

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.background,
    alignSelf: 'stretch',
  },
  title: {
    fontFamily: 'Playfair',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 1.2,
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: Colors.gray,
    letterSpacing: 1.2,
    lineHeight: 24,
  },
  menu: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    gap: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    gap: 10,
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
    marginBottom: 10,
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
