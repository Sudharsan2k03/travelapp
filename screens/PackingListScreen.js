import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, FlatList, 
  TouchableOpacity, StyleSheet, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PackingListScreen({ navigation, route }) {
  const { city } = route.params || {};  // Get city name from route
  const [items, setItems] = useState([]);  // Packing list items
  const [itemText, setItemText] = useState('');  // Input for new item
  const [editingItem, setEditingItem] = useState(null); // Store editing item

  useEffect(() => {
    loadPackingList();
  }, []);

  useEffect(() => {
    savePackingList();
  }, [items]);

  // Load stored packing list
  const loadPackingList = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('packingList');
      if (savedItems) setItems(JSON.parse(savedItems));
    } catch (error) {
      console.error("Error loading packing list:", error);
    }
  };

  // Save packing list to storage
  const savePackingList = async () => {
    try {
      await AsyncStorage.setItem('packingList', JSON.stringify(items));
    } catch (error) {
      console.error("Error saving packing list:", error);
    }
  };

  // Add a new item or update existing one
  const handleAddOrEditItem = () => {
    if (!itemText.trim()) return;
    
    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...item, name: itemText } : item));
      setEditingItem(null);
    } else {
      setItems([...items, { id: Date.now().toString(), name: itemText, packed: false }]);
    }
    
    setItemText('');
  };

  // Delete an item
  const deleteItem = (id) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => setItems(items.filter(item => item.id !== id)) }
    ]);
  };

  // Toggle packed/unpacked state
  const togglePacked = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  // Edit an item
  const editItem = (item) => {
    setItemText(item.name);
    setEditingItem(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Packing List for {city || 'Trip'}</Text>

      {/* Input field for adding/editing items */}
      <TextInput
        style={styles.input}
        placeholder="Enter item (e.g. Clothes, Shoes)"
        value={itemText}
        onChangeText={setItemText}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrEditItem}>
        <Text style={styles.addButtonText}>{editingItem ? "Update Item" : "Add Item"}</Text>
      </TouchableOpacity>

      {/* Packing List Display */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.packed && styles.packedItem]}>
            <TouchableOpacity onPress={() => togglePacked(item.id)} style={{ flex: 1 }}>
              <Text style={styles.itemText}>
                {item.packed ? '✅' : '⬜'} {item.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => editItem(item)} style={styles.editButton}>
              <Text style={styles.buttonText}>✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Check Weather Button */}
      {city && (
        <TouchableOpacity style={styles.weatherButton} onPress={() => navigation.navigate('Weather', { city })}>
          <Text style={styles.weatherButtonText}>Check Weather</Text>
        </TouchableOpacity>
      )}
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
  item: { 
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
  packedItem: { 
    backgroundColor: '#d4edda'  // Light green when packed
  },
  itemText: { 
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
  },
  weatherButton: { 
    backgroundColor: '#007bff', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 20 
  },
  weatherButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'white' 
  }
});
