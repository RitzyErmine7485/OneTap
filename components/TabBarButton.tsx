import { Text } from '@react-navigation/elements';
import { Pressable } from "react-native";
import { icon } from '@/constants/Icons';
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native'; 
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';

type Props = {
    onPress: Function;
    onLongPress: Function;
    isFocused: boolean;
    label: string;
    routeName: string;
}

export const TabBarButton = (props: Props) => {
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

    const {onPress, onLongPress, isFocused, label, routeName} = props

    return (
        <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabbarbtn}
        >
            { icon[routeName]({
                color: isFocused ? Colors.primary : Colors.gray
            })}

            <Text style={{ color: isFocused ? Colors.primary : Colors.gray, fontFamily: 'Playfair', }}>
                {label}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tabbarbtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
})
