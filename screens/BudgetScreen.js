import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BudgetScreen() {
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [budget, setBudget] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    loadBudgetData();
  }, []);

  // Load saved budget and expenses from AsyncStorage
  const loadBudgetData = async () => {
    try {
      const savedExpenses = await AsyncStorage.getItem('expenses');
      const savedBudget = await AsyncStorage.getItem('budget');
      const savedTotal = await AsyncStorage.getItem('total');

      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedBudget) setBudget(savedBudget);
      if (savedTotal) setTotal(parseFloat(savedTotal));
    } catch (error) {
      console.error("Error loading budget data:", error);
    }
  };

  // Save expenses and budget to AsyncStorage
  const saveBudgetData = async (updatedExpenses, updatedTotal, updatedBudget) => {
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      await AsyncStorage.setItem('total', updatedTotal.toString());
      await AsyncStorage.setItem('budget', updatedBudget.toString());
    } catch (error) {
      console.error("Error saving budget data:", error);
    }
  };

  // Add or Update Expense
  const addOrUpdateExpense = () => {
    if (!expense.trim() || !amount.trim()) {
      Alert.alert("Error", "Please enter valid expense and amount.");
      return;
    }

    const expenseAmount = parseFloat(amount);

    let updatedExpenses;
    let updatedTotal;

    if (editIndex !== null) {
      // Update existing expense
      updatedExpenses = [...expenses];
      updatedExpenses[editIndex] = { id: Date.now().toString(), name: expense, amount: expenseAmount };
      updatedTotal = updatedExpenses.reduce((sum, item) => sum + item.amount, 0);
      setEditIndex(null);
    } else {
      // Add new expense
      updatedExpenses = [...expenses, { id: Date.now().toString(), name: expense, amount: expenseAmount }];
      updatedTotal = total + expenseAmount;
    }

    setExpenses(updatedExpenses);
    setTotal(updatedTotal);
    setExpense('');
    setAmount('');
    saveBudgetData(updatedExpenses, updatedTotal, budget);
  };

  // Delete Expense
  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    const newTotal = updatedExpenses.reduce((sum, item) => sum + item.amount, 0);
    
    setExpenses(updatedExpenses);
    setTotal(newTotal);
    saveBudgetData(updatedExpenses, newTotal, budget);
  };

  // Edit Expense
  const editExpense = (index) => {
    setExpense(expenses[index].name);
    setAmount(expenses[index].amount.toString());
    setEditIndex(index);
  };

  // Update Budget
  const updateBudget = (value) => {
    setBudget(value);
    saveBudgetData(expenses, total, value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Budget Tracker</Text>

      {/* Budget Input */}
      <TextInput
        style={styles.input}
        placeholder="Set Budget Limit (Optional)"
        keyboardType="numeric"
        value={budget}
        onChangeText={updateBudget}
      />

      {/* Expense Input */}
      <TextInput
        style={styles.input}
        placeholder="Expense Name (e.g. Hotel)"
        value={expense}
        onChangeText={setExpense}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount (e.g. 500)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title={editIndex !== null ? "Update Expense" : "Add Expense"} onPress={addOrUpdateExpense} />

      {/* Budget Summary */}
      <Text style={styles.total}>Total Spent: ₹{total.toFixed(2)}</Text>
      {budget ? (
        <Text style={[styles.remainingBudget, total > parseFloat(budget) ? styles.overBudget : styles.underBudget]}>
          Remaining Budget: ₹{(parseFloat(budget) - total).toFixed(2)}
        </Text>
      ) : null}

      {/* Expenses List */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseText}>{item.name}: ₹{item.amount.toFixed(2)}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => editExpense(index)} style={styles.editButton}>
                <Text style={styles.buttonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteExpense(index)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  remainingBudget: { fontSize: 16, fontWeight: 'bold', padding: 5, marginVertical: 5, textAlign: 'center' },
  overBudget: { color: 'red' },
  underBudget: { color: 'green' },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
  expenseText: { fontSize: 16 },
  buttons: { flexDirection: 'row' },
  editButton: { marginRight: 10, backgroundColor: 'blue', padding: 5, borderRadius: 5 },
  deleteButton: { backgroundColor: 'red', padding: 5, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16 }
});
