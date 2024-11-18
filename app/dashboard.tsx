import { StyleSheet, Text, TouchableOpacity, View, FlatList, ScrollView, Image } from 'react-native';
import { router, SplashScreen, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

type Props = {}

const Dashboard = (props: Props) => { 
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
  
  const recentFiles = [
    "report_october.csv",
    "report_september.csv",
    "report_august.csv",
  ];

  return (
    <>
      <Stack.Screen options={{
        header: () => <Header />, 
      }} />

      <View style={styles.container}>
        
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { router.replace('/profile') }}>
            <Text style={styles.sectionTitle}><Ionicons name='finger-print-outline' style={{ color: Colors.primary }} size={16} /> Profile Info</Text>
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' }} 
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileText}>Name: John Doe</Text>
              <Text style={styles.profileText}>Email: john.doe@example.com</Text>
            </View>
          </View>
        </View>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {["Products", "Store", "Monthly", "Yearly"].map((action, index) => (
              <TouchableOpacity key={index} style={styles.carouselButton}>
                <Ionicons name="albums-outline" size={ 30 } color={Colors.primary} />
                <Text style={styles.buttonText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Recent CSV Files</Text>
          <FlatList
            data={recentFiles}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.fileItem}>
                <Ionicons name="document-text-outline" size={ 20 } color={Colors.primary} />
                <Text style={styles.fileName}>{item}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  profileImage: {
    height: 75,
    width: 75,
    borderRadius: 30,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.bar,
    borderRadius: 8,
    justifyContent: 'space-evenly',
    flexShrink: 1,
  },
  profileText: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 5,
  },
  carousel: {
    flexDirection: 'row',
  },
  carouselButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bar,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    width: 200,
    height: 200,
  },
  buttonText: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: Colors.primary,
    marginTop: 5,
    textAlign: 'center',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fileName: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.gray,
    marginLeft: 8,
  },
});
