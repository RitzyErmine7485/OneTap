import React from 'react';
import { Tabs } from "expo-router";
import { TabBar } from '@/components/TabBar';
import { useNavigationState } from '@react-navigation/native';
import { StatusBar } from 'react-native';

export default function TabLayout() {
  const routeName = useNavigationState(state => state.routes[state.index]?.name);
  const showTabBarScreens = ['dashboard', 'upload', 'report'];
  const shouldShowTabBar = showTabBarScreens.includes(routeName);

  return (
    <>
      <Tabs tabBar={props => (shouldShowTabBar ? <TabBar {...props} /> : null)}>
        <Tabs.Screen name="dashboard" options={{ title: 'Home' }} />
        <Tabs.Screen name="upload" options={{ title: 'Upload' }} />
        <Tabs.Screen name="report" options={{ title: 'Reports' }} />
      </Tabs>

      <StatusBar barStyle={'light-content'}/>
    </>
  );
}