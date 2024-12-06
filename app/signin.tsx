import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { router, SplashScreen, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import InputField from '@/components/InputField';
import { useFonts } from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type Props = {};

const SignInScreen = (props: Props) => {
  const [fontsLoaded] = useFonts({
    'Playfair': require('../assets/fonts/Playfair.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
    setEmail('');
    setPassword('');

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    } else {
      SplashScreen.preventAutoHideAsync();
    }

    }, [fontsLoaded])
  );

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://backendot.onrender.com/login', {
        email,
        password,
      });

      if (response.status == 200) {
        const token = response.data.token;
        await AsyncStorage.setItem('authToken', token);

        router.replace('/dashboard');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.menu}>
          <Text style={styles.title}>Login Account</Text>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }} onPress={() => { router.replace('/') }}>
            <Ionicons name="arrow-back-outline" size={20} color={Colors.gray} />
            <Text style={styles.subtitle}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <View>
          <InputField
            placeholder='Email'
            placeholderTextColor={Colors.gray}
            autoCapitalize='none'
            keyboardType='email-address'
            value={email}
            onChangeText={setEmail}
          />
          <InputField
            placeholder='Password'
            placeholderTextColor={Colors.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.btnTxt}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.signupTxt}>
              Don't have an account? {" "}
            </Text>

            <TouchableOpacity onPress={() => { router.replace('/signup') }}>
              <Text style={styles.signupTxtSpan}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />
        </View>
      </View>
    </>
  );
};

export default SignInScreen;

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
    color: Colors.primary,
  },
  divider: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '30%',
    marginTop: 10,
  },
});
