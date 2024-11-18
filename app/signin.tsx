import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { router, SplashScreen, Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import InputField from '@/components/InputField'
import { useFonts } from 'expo-font'

type Props = {}

const SignInScreen = (props: Props) => {
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
          <Text style={styles.title}>Login Account</Text>

          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 25}} onPress={() => { router.replace('/') }} >
            <Ionicons name="arrow-back-outline" size={20} color={Colors.gray} />
            <Text style={styles.subtitle}>Go Back</Text>
          </TouchableOpacity>  
        </View>

        <View>
          <InputField placeholder='Email' placeholderTextColor={Colors.gray} autoCapitalize='none' keyboardType='email-address' />
          <InputField placeholder='Password' placeholderTextColor={Colors.gray} secureTextEntry={true} />

          <TouchableOpacity style={styles.button} onPress={() => { router.replace('/dashboard') }}>
            <Text style={styles.btnTxt}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.signupTxt}>
              Don't hove an account? {" "}
            </Text>

            <TouchableOpacity onPress={() => { router.replace('/signup') }}>
              <Text style={styles.signupTxtSpan}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />
        </View>
      </View>
    </>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 20,
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
  inputField: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: 'black',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: 'stretch',
    borderRadius: 10,
    marginBottom: 20,
  },
  menu: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    gap: 5,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  btnTxt: {
    fontFamily: 'Playfair',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
  },
  signupTxt: {
    fontFamily: 'Playfair',
    fontSize: 14,
    color: Colors.white,
    lineHeight: 24,
  },
  signupTxtSpan: {
    fontFamily: 'Playfair',
    fontWeight: '600',
    color: Colors.primary
  },
  divider: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '30%',
    marginTop: 10,
  },
  
})