import { StyleSheet, TextInput, View } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";

type Props = {}

const InputField = (props: React.ComponentProps<typeof TextInput>) => {
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
      
    return(
        <TextInput
        style={styles.inputField}
        {...props}
        />
    )
}

export default InputField

const styles = StyleSheet.create({
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
})