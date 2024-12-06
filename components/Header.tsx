import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, SplashScreen, useFocusEffect } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const [fontsLoaded] = useFonts({
    'Playfair': require('../assets/fonts/Playfair.ttf'),
    'PlayfairItalic': require('../assets/fonts/PlayfairItalic.ttf'),
  });

  const [userData, setUserData] = useState(null);
  
  useFocusEffect(
    React.useCallback(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      } else {
        SplashScreen.preventAutoHideAsync();
      }

      const fetchProfileData = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const response = await fetch('https://backendot.onrender.com/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }

          const data = await response.json();
          setUserData(data);
        } catch (error) {
          Alert.alert('Error', 'Failed to load profile data.');
        }
      };

      fetchProfileData();
    }, [fontsLoaded])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  if (!fontsLoaded || !userData) {
    return null; 
  }

  return (
    <View style={{ backgroundColor: Colors.bar, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 70, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image 
          source={{ uri: userData.imageUri }}
          style={{ height: 50, width: 50, borderRadius: 30 }} 
        />

        <Text style={{ color: Colors.white, fontSize: 14, fontFamily: 'Playfair' }}>
          Hello, {"\n"}
          <Text style={{ fontWeight: '600', fontFamily: 'PlayfairItalic' }}>
            {userData.username || 'User'} {}
          </Text>
        </Text>
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        style={{ flexDirection: 'row', alignItems: 'center', borderColor: Colors.gray, borderWidth: 1, padding: 8, borderRadius: 10, gap: 5 }}>
        <Text style={{ color: Colors.white, fontSize: 14, fontFamily: 'Playfair' }}>
          Logout
        </Text>
        <Ionicons name='exit-outline' size={16} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
