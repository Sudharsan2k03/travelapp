import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, FlatList, 
  TouchableOpacity, StyleSheet, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MultiDestinationScreen() {
  const [destination, setDestination] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [editingDestination, setEditingDestination] = useState(null);

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    saveDestinations();
  }, [destinations]);

  // Load stored destinations
  const loadDestinations = async () => {
    try {
      const savedDestinations = await AsyncStorage.getItem('destinations');
      if (savedDestinations) setDestinations(JSON.parse(savedDestinations));
    } catch (error) {
      console.error("Error loading destinations:", error);
    }
  };

  // Save destinations to storage
  const saveDestinations = async () => {
    try {
      await AsyncStorage.setItem('destinations', JSON.stringify(destinations));
    } catch (error) {
      console.error("Error saving destinations:", error);
    }
  };

  // Add a new destination or update an existing one
  const handleAddOrEditDestination = () => {
    if (!destination.trim()) return;

    if (editingDestination) {
      setDestinations(destinations.map(item => item.id === editingDestination.id ? { ...item, name: destination } : item));
      setEditingDestination(null);
    } else {
      setDestinations([...destinations, { id: Date.now().toString(), name: destination }]);
    }
    
    setDestination('');
  };

  // Delete a destination
  const deleteDestination = (id) => {
    Alert.alert("Delete Destination", "Are you sure you want to delete this destination?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => setDestinations(destinations.filter(item => item.id !== id)) }
    ]);
  };

  // Edit a destination
  const editDestination = (item) => {
    setDestination(item.name);
    setEditingDestination(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Destination Spots</Text>

      {/* Input field for adding/editing destinations */}
      <TextInput
        style={styles.input}
        placeholder="Enter Destination"
        value={destination}
        onChangeText={setDestination}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrEditDestination}>
        <Text style={styles.addButtonText}>{editingDestination ? "Update Destination" : "Add Destination"}</Text>
      </TouchableOpacity>

      {/* Destination List Display */}
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.destinationItem}>
            <Text style={styles.destinationText}>📍 {item.name}</Text>

            <TouchableOpacity onPress={() => editDestination(item)} style={styles.editButton}>
              <Text style={styles.buttonText}>✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteDestination(item.id)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#F5F5F5' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#333' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#aaa', 
    padding: 12, 
    borderRadius: 8, 
    backgroundColor: '#fff', 
    marginBottom: 10 
  },
  addButton: { 
    backgroundColor: '#28a745', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  addButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  destinationItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    marginVertical: 5, 
    backgroundColor: '#fff', 
    borderRadius: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 2 
  },
  destinationText: { 
    fontSize: 18, 
    flex: 1, 
    color: '#333' 
  },
  editButton: { 
    backgroundColor: '#ffc107', 
    padding: 8, 
    borderRadius: 5, 
    marginHorizontal: 5 
  },
  deleteButton: { 
    backgroundColor: '#dc3545', 
    padding: 8, 
    borderRadius: 5 
  },
  buttonText: { 
    fontSize: 18, 
    color: 'white' 
  }
});
