import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { router, SplashScreen, Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { useFonts } from 'expo-font'

type Props = {}

const GoogleSignInScreen = (props: Props) => {  
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
        <View style={styles.menu}>
          <Text style={styles.title}>Sign with Google</Text>

          <TouchableOpacity onPress={() => { router.replace('/') }} >
              <Text style={styles.subtitle}>Coming Soon...</Text>
            </TouchableOpacity>  
        </View>
      </View>
    </>
  )
}

export default GoogleSignInScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
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
})