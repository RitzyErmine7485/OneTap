import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { router, SplashScreen, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInRight, FadeInUp } from "react-native-reanimated";
import { useFonts } from 'expo-font';

type Props = {};

const WelcomeScreen = (props: Props) => {
  const [fontsLoaded] = useFonts({
    'Playfair': require('../assets/fonts/Playfair.ttf'),
    'PlayfairItalic': require('../assets/fonts/PlayfairItalic.ttf'),
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

      <ImageBackground source={require('@/assets/images/bg.jpeg')} style={{flex: 1}} resizeMode="cover">
        <View style={{flex: 1}} >
          <LinearGradient colors={["transparent", 'rgba(28, 28, 28, 0.9)', 'rgba(28, 28, 28, 1)']} style={styles.background}>
            <View style={styles.wrapper}>
              <Animated.Text style={styles.title} entering={FadeInUp.delay(300).duration(300).springify()}>OneTap</Animated.Text>
              <Animated.Text style={styles.description} entering={FadeInUp.delay(500).duration(300).springify()}>See beyond the numbers.</Animated.Text>

              <Animated.View style={{alignSelf: 'stretch'}} entering={FadeInRight.delay(700).duration(500)}>
                <TouchableOpacity style={styles.button} onPress={() => { router.replace('/signup') }}>
                  <Ionicons name="mail-outline" size={20} color={'white'}/>
                  <Text style={styles.btnTxt}>Continue with Email</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{alignSelf: 'stretch'}} entering={FadeInRight.delay(900).duration(500)}>
                <TouchableOpacity style={styles.button} onPress={() => { router.replace('/google') }}>
                  <Ionicons name="logo-google" size={20} color={'white'}/>
                  <Text style={styles.btnTxt}>Continue with Google</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{alignItems: 'center'}} entering={FadeIn.delay(1100).duration(500)}>
                <Text style={styles.signupTxt}>
                  Already have an account? {" "}
                </Text>

                <TouchableOpacity onPress={() => { router.replace('/signin') }}>
                  <Text style={styles.signupTxtSpan}>Sign In</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
    </>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  wrapper: {
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    rowGap: 5,
  },
  title: {
    fontFamily: 'PlayfairItalic',
    fontSize: 35,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 2.4,
    marginBottom: 5,
  },
  description: {
    fontFamily: 'Playfair',
    fontSize: 25,
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: 1.2,
    lineHeight: 30,
    marginBottom: 20,    
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: Colors.gray,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
    justifyContent: 'center',
    gap: 5,
    marginBottom: 15,
  },
  btnTxt: {
    fontFamily: 'Playfair',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  signupTxt: {
    fontFamily: 'Playfair',
    fontSize: 14,
    color: Colors.white,
    lineHeight: 24,
    marginTop: 30,
  },
  signupTxtSpan: {
    fontFamily: 'Playfair',
    fontWeight: '600',
    color: Colors.primary
  },
});
