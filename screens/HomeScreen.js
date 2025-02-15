import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Travel Packing Assistant</Text>
      <Text style={styles.subtitle}>Plan your trips with ease</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TripDetails')}>
        <Text style={styles.buttonText}>Plan a Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#87CEEB', // Light Blue Background
    padding: 20 
  },
  title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#fff', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 18, 
    color: '#f0f0f0', 
    textAlign: 'center', 
    marginBottom: 30 
  },
  button: { 
    backgroundColor: '#FF6347', // Tomato color button
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    elevation: 5,
    alignItems: 'center'
  },
  buttonText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: 'white' 
  }
});
