import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';
import PackingListScreen from './screens/PackingListScreen';
import WeatherScreen from './screens/WeatherScreen';
import SettingsScreen from './screens/SettingsScreen';
import BudgetScreen from './screens/BudgetScreen';
import MultiDestinationScreen from './screens/MultiDestinationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
        <Stack.Screen name="PackingList" component={PackingListScreen} />
        <Stack.Screen name="Weather" component={WeatherScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Budget" component={BudgetScreen} />
        <Stack.Screen name="MultiDestination" component={MultiDestinationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
