import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { router, SplashScreen, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

type Props = {}

const Profile = (props: Props) => {
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

    return (
      <>
        <Stack.Screen options={{ headerShown: false, }} />
        
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Profile Picture */}
            <TouchableOpacity style={styles.profileImageContainer} onPress={() => { /* Handle profile picture change */ }}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' }}
                style={styles.profileImage}
              />
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>

            {/* Profile Menu Options */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => { /* Handle username change */ }}>
                  <Ionicons name="person-outline" size={ 20 } color={Colors.primary} />
                  <Text style={styles.menuText}>Edit Username</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => { /* Handle password reset */ }}>
                  <Ionicons name="key-outline" size={ 20 } color={Colors.primary} />
                  <Text style={styles.menuText}>Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => { /* Handle account deletion */ }}>
                <Ionicons name="trash-outline" size={ 20 } color={Colors.danger} />
                  <Text style={[styles.menuText, { color: Colors.danger }]}>Delete Account</Text>
                </TouchableOpacity>
            </View>
          </View>
          
          {/* Go Back Button at the Bottom */}
          <TouchableOpacity style={{ padding: 20 }} onPress={() => { router.replace('/dashboard') }} >
            <Ionicons name="arrow-back-outline" size={ 30 } color={Colors.gray} />
          </TouchableOpacity>
        </View>
      </>
    );
}

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
});
