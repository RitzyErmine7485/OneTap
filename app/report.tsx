import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import { useFonts } from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

type Props = {}

const FileReport = (props: Props) => {
  const [fontsLoaded] = useFonts({
    'Playfair': require('../assets/fonts/Playfair.ttf'),
  });

  const [data, setData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any>(null);
  const [statistics, setStatistics] = useState({
    topProduct: '',
    mostProfitableStore: '',
    highestSalesMonth: '',
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    } else {
      SplashScreen.preventAutoHideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        const response = await axios.get('https://backendot.onrender.com/get-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data[0]?.file_name)
        
        const fileName = response.data[0].file_name;
        
        if (fileName) {
          const csvResponse = await axios.post(
            'https://backendot.onrender.com/get-csv', 
            { file_name: fileName },   
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const csvData = csvResponse.data.data;

          processGraphData(csvData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const processGraphData = (csvData: any) => {
    const processedData: any = {};
    const storeSales: any = {}; 
    const monthlySales: any = {}; 

    csvData.forEach((entry: any) => {
      const { month, store_id, product_id, units_sold } = entry;

      if (!processedData[store_id]) {
        processedData[store_id] = {};
      }
      if (!processedData[store_id][month]) {
        processedData[store_id][month] = {};
      }

      if (!processedData[store_id][month][product_id]) {
        processedData[store_id][month][product_id] = 0;
      }
      processedData[store_id][month][product_id] += units_sold;

      if (!storeSales[store_id]) {
        storeSales[store_id] = 0;
      }
      storeSales[store_id] += units_sold;

      if (!monthlySales[month]) {
        monthlySales[month] = 0;
      }
      monthlySales[month] += units_sold;
    });

    const graphData: any = [];
    let topProduct = '';
    let mostProfitableStore = '';
    let highestSalesMonth = '';
    let maxStoreSales = 0;
    let maxMonthSales = 0;

    Object.keys(processedData).forEach((store_id) => {
      Object.keys(processedData[store_id]).forEach((month) => {
        const productSales = processedData[store_id][month];
        const topProductForMonth = Object.keys(productSales).reduce((a, b) =>
          productSales[a] > productSales[b] ? a : b
        );

        graphData.push({
          store_id,
          month,
          top_product: topProductForMonth,
          units_sold: productSales[topProductForMonth],
        });

        if (!topProduct || productSales[topProductForMonth] > graphData[topProduct]?.units_sold) {
          topProduct = topProductForMonth;
        }
      });

      if (storeSales[store_id] > maxStoreSales) {
        maxStoreSales = storeSales[store_id];
        mostProfitableStore = store_id;
      }
    });

    Object.keys(monthlySales).forEach((month) => {
      if (monthlySales[month] > maxMonthSales) {
        maxMonthSales = monthlySales[month];
        highestSalesMonth = month;
      }
    });

    setGraphData(graphData);
    setStatistics({
      topProduct,
      mostProfitableStore,
      highestSalesMonth,
    });
  };

  if (!fontsLoaded || !graphData) {
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
          <Text style={styles.sectionTitle}>Best Selling Products by Store</Text>
          {graphData && (
            <LineChart
              data={{
                labels: graphData.map((entry: any) => `${entry.store_id} - ${entry.month}`),
                datasets: [
                  {
                    data: graphData.map((entry: any) => entry.units_sold),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 30}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: Colors.background,
                backgroundGradientFrom: Colors.background,
                backgroundGradientTo: Colors.background,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          )}
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Summary Statistics</Text>
          <View style={styles.statsBox}>
            <Text style={styles.statText}>Top Product: {statistics.topProduct || 'N/A'}</Text>
            <Text style={styles.statText}>Most Profitable Store: {statistics.mostProfitableStore || 'N/A'}</Text>
            <Text style={styles.statText}>Highest Sales Month: {statistics.highestSalesMonth || 'N/A'}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

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
  graphSection: {
    marginBottom: 20,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsBox: {
    padding: 8,
    backgroundColor: Colors.bar,
    borderRadius: 8,
  },
  statText: {
    fontFamily: 'Playfair',
    fontSize: 16,
    color: Colors.gray,
  },
  menu: {
    width: '100%',
    marginTop: 20,
  },
});
