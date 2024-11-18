import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import { Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, SplashScreen } from 'expo-router'
import { useFonts } from 'expo-font'

const Header = () => {
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
        <View style={{ backgroundColor: Colors.bar, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 70, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image 
                    source={{uri: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'}} 
                    style={{ height: 50, width: 50, borderRadius: 30}} />

                <Text style={{ color: Colors.white, fontSize: 14, fontFamily: 'Playfair', }}>
                    Hello, {"\n"}
                    <Text style={{ fontWeight: '600', fontFamily: 'PlayfairItalic', }}>John Doe</Text>!
                </Text>
            </View>

            <TouchableOpacity 
            onPress={() => { router.replace('/') }} 
            style={{ flexDirection: 'row', alignItems: 'center', borderColor: Colors.gray, borderWidth: 1, padding: 8, borderRadius: 10, gap: 5 }}>
                <Text style={{ color: Colors.white, fontSize: 14, fontFamily: 'Playfair', }}>
                    Logout
                </Text>
                <Ionicons name='exit-outline' size={16} color={Colors.white} />
            </TouchableOpacity>
        </View>
  )
}

export default Header