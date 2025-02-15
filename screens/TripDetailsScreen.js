import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function TripDetailsScreen({ navigation }) {
  const [destination, setDestination] = useState('');

  // Function to validate and navigate
  const handleNavigation = (screen) => {
    if (!destination.trim()) { // Checks if the destination is empty
      Alert.alert("Enter Destination", "Please enter a destination before proceeding!");
    } else {
      navigation.navigate(screen, { city: destination });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Your Trip</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Enter Destination" 
        placeholderTextColor="#aaa"
        onChangeText={setDestination} 
        value={destination} 
      />

      {/* ✅ Styled Buttons */}
      <TouchableOpacity style={[styles.button, styles.weatherButton]} onPress={() => handleNavigation('Weather')}>
        <Text style={styles.buttonText}>Check Weather</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.listButton]} onPress={() => handleNavigation('PackingList')}>
        <Text style={styles.buttonText}>Generate Packing List</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.budgetButton]} onPress={() => handleNavigation('Budget')}>
        <Text style={styles.buttonText}>Manage Budget</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.placesButton]} onPress={() => handleNavigation('MultiDestination')}>
        <Text style={styles.buttonText}>Destination Places</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333' 
  },
  input: { 
    borderWidth: 2, 
    borderColor: '#555', 
    width: '90%', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 20, 
    fontSize: 18, 
    backgroundColor: '#fff' 
  },
  button: { 
    width: '90%', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginVertical: 8 
  },
  buttonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  weatherButton: { backgroundColor: '#007bff' }, // Blue
  listButton: { backgroundColor: '#28a745' }, // Green
  budgetButton: { backgroundColor: '#ff5722' }, // Orange
  placesButton: { backgroundColor: '#6a0dad' }  // Purple
});
