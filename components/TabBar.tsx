import { LayoutChangeEvent, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native'; 
import { TabBarButton } from './TabBarButton';
import { Colors } from '@/constants/Colors';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

export function TabBar({ state, descriptors, navigation } : BottomTabBarProps ) {
    const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  
    const filteredRoutes = state.routes.filter(route =>
      ['dashboard', 'upload', 'report'].includes(route.name)
    );
  
    const buttonWidth = dimensions.width / filteredRoutes.length;
  
    useEffect(() => {
      const filteredIndex = filteredRoutes.findIndex(
        route => route.key === state.routes[state.index].key
      );
      tabPosX.value = withTiming(buttonWidth * filteredIndex, { duration: 200 });
    }, [state.index]);
  
    const onTabBarLayout = (e: LayoutChangeEvent) => {
      setDimensions({
        height: e.nativeEvent.layout.height,
        width: e.nativeEvent.layout.width,
      });
    };
  
    const tabPosX = useSharedValue(0);
  
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: tabPosX.value }],
      };
    });
  
    return (
      <View onLayout={onTabBarLayout} style={styles.tabbar}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              backgroundColor: Colors.primary,
              top: 0,
              left: 32,
              height: 2,
              width: buttonWidth / 2,
            },
          ]}
        />
  
        {filteredRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
  
          const isFocused = state.index === state.routes.indexOf(route);
  
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
  
          return (
            <TabBarButton
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              label={label}
              routeName={route.name}
            />
          );
        })}
      </View>
    );
  }
  

const styles = StyleSheet.create({
    tabbar: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        backgroundColor: Colors.bar,
    },
})

