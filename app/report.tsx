import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { router, SplashScreen, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { useFonts } from 'expo-font';

type Props = {}

const FileReport = (props: Props) => {
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
      <Stack.Screen options={{
        header: () => <Header />, 
      }} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.menu}>
          <Text style={styles.title}>Report</Text> 
          <Text style={styles.subtitle}>Analysis of Uploaded Data</Text>
        </View>

        {/* Graph Section */}
        <View style={styles.graphSection}>
          <Text style={styles.sectionTitle}>Sales Over Time</Text>
          <View style={styles.graphPlaceholder}>
            <Text style={styles.graphText}>Graph Placeholder</Text>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Summary Statistics</Text>
          <View style={styles.statsBox}>
            <Text style={styles.statText}>Top Product: Product A</Text>
            <Text style={styles.statText}>Most Profitable Store: Store B</Text>
            <Text style={styles.statText}>Highest Sales Month: October</Text>
          </View>
        </View>

        {/* Placeholder for other graphs or analyses */}
        <View style={styles.otherGraphsSection}>
          <Text style={styles.sectionTitle}>Product and Inventory Insights</Text>
          <View style={styles.graphPlaceholder}>
            <Text style={styles.graphText}>Additional Graph Placeholder</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default FileReport;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 16,
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
    marginBottom: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    fontFamily: 'Playfair',
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 10,
  },
  menu: {
    alignItems: 'center',
    padding: 10,
  },
  graphSection: {
    marginBottom: 20,
  },
  graphPlaceholder: {
    height: 200,
    backgroundColor: Colors.bar,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphText: {
    fontFamily: 'Playfair',
    color: Colors.gray,
    fontSize: 16,
  },
  statsSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.bar,
    borderRadius: 8,
  },
  statsBox: {
    gap: 8,
  },
  statText: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.white,
  },
  otherGraphsSection: {
    marginBottom: 20,
  },
});
