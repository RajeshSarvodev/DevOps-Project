import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const PayrollSchedule = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [payRate, setPayRate] = useState('');
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const snapshot = await getDocs(collection(db, 'schedules'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSchedules(list);
  };

  const handleAddSchedule = async () => {
    if (!employeeName || !hoursWorked || !payRate) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'schedules'), {
        employeeName,
        hoursWorked: parseFloat(hoursWorked),
        payRate: parseFloat(payRate),
        date: new Date()
      });
      fetchSchedules();
      setEmployeeName('');
      setHoursWorked('');
      setPayRate('');
    } catch (err) {
      console.error('Add schedule error:', err);
    }
  };

  const calculatePayroll = (schedule) => {
    return schedule.hoursWorked * schedule.payRate;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payroll & Scheduling</Text>
      <TextInput
        placeholder="Employee Name"
        style={styles.input}
        value={employeeName}
        onChangeText={setEmployeeName}
      />
      <TextInput
        placeholder="Hours Worked"
        style={styles.input}
        value={hoursWorked}
        onChangeText={setHoursWorked}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Pay Rate"
        style={styles.input}
        value={payRate}
        onChangeText={setPayRate}
        keyboardType="numeric"
      />
      <Button title="Add Schedule" onPress={handleAddSchedule} />

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text>{item.employeeName}</Text>
            <Text>Hours: {item.hoursWorked}</Text>
            <Text>Rate: ${item.payRate}</Text>
            <Text>Pay: ${calculatePayroll(item).toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginVertical: 6, borderRadius: 8
  },
  scheduleItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8
  }
});

export default PayrollSchedule;