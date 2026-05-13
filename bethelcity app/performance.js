import React, { useState, useEffect } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,  FlatList,  Alert,  Button,  StyleSheet,  ScrollView,
  Image,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getDocs, collection, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [businessName, setBusinessName] = useState('My Business');

  const handleAdminLogin = () => {
    if (adminUser === 'admin' && adminPass === 'admin@123') {
      setIsAdmin(true);
      setShowLogin(false);
    } else {
      alert('Incorrect credentials');
    }
  };
  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require('./pictures/Bethellogo.jpg')} style={styles.logo} />
      <Text style={styles.title}>Business Management System</Text>
      <Text style={styles.businessName}>Business: {businessName}</Text>

      {isAdmin ? (
        <Button title='Logout Admin' color='#d9534f' onPress={handleLogout} />
      ) : (
        <TouchableOpacity style={styles.iconButton} onPress={() => setShowLogin(true)}>
          <Ionicons name='person-circle-outline' size={40} color='black' />
        </TouchableOpacity>
      )}

      {showLogin && !isAdmin && (
        <View style={styles.loginForm}>
          <TextInput
            placeholder='Admin Username'
            style={styles.input}
            value={adminUser}
            onChangeText={setAdminUser}
          />
          <TextInput
            placeholder='Password'
            style={styles.input}
            value={adminPass}
            onChangeText={setAdminPass}
            secureTextEntry
          />
          <Button title='Login' onPress={handleAdminLogin} />
          <Button
            title='Cancel'
            color='#6c757d'
            onPress={() => setShowLogin(false)}
          />
        </View>
      )}

      <View style={styles.tabsContainer}>
        <Button
          title='Dashboard'
          onPress={() => setActiveTab('dashboard')}
          color={activeTab === 'dashboard' ? '#007bff' : '#ccc'}
        />
        <Button
          title='Payroll & Scheduling'
          onPress={() => setActiveTab('payroll')}
          color={activeTab === 'payroll' ? '#007bff' : '#ccc'}
        />
      </View>

      {activeTab === 'dashboard' && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          {/* You can fetch and display real data here */}
          <Text>Employees: 10</Text>
          <Text>Performance Sum: 150</Text>
          <Text>Revenue: £1000.00</Text>
        </View>
      )}

      {activeTab === 'payroll' && <Payroll isAdmin={isAdmin} />}
    </ScrollView>
  );
};

function Payroll({ isAdmin }) {
  const [employeeName, setEmployeeName] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [employerDesignation, setEmployerDesignation] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [payType, setPayType] = useState('hourly');
  const [payRate, setPayRate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [daysWorked, setDaysWorked] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const snap = await getDocs(collection(db, 'schedules'));
      setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Fetch schedules error:', err);
    }
  };

  const handleAddOrUpdate = async () => {
    if (
      !employeeName || !employerName || !payRate || !daysWorked || !hoursPerDay
      || !employerDesignation || !monthYear
    ) {
      alert('Fill all fields');
      return;
    }

    const rate = parseFloat(payRate);
    const days = parseFloat(daysWorked);
    const hours = parseFloat(hoursPerDay);
    let totalEarned = 0;

    if (payType === 'hourly') {
      totalEarned = rate * hours * days;
    } else if (payType === 'monthly') {
      totalEarned = rate * days;
    } else if (payType === 'annually') {
      totalEarned = rate;
    }

    if (editingId) {
      await updateDoc(doc(db, 'schedules', editingId), {
        employeeName,
        employerName,
        employerDesignation,
        monthYear,
        payType,
        payRate: rate,
        hoursPerDay: hours,
        daysWorked: days,
        totalEarned,
      });
    } else {
      await addDoc(collection(db, 'schedules'), {
        employeeName,
        employerName,
        employerDesignation,
        monthYear,
        payType,
        payRate: rate,
        hoursPerDay: hours,
        daysWorked: days,
        totalEarned,
        date: new Date(),
      });
    }
    fetchSchedules();

    
    setEmployeeName('');
    setEmployerName('');
    setEmployerDesignation('');
    setMonthYear('');
    setPayRate('');
    setHoursPerDay('8');
    setDaysWorked('');
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEmployeeName(item.employeeName);
    setEmployerName(item.employerName);
    setEmployerDesignation(item.employerDesignation || '');
    setMonthYear(item.monthYear || '');
    setPayType(item.payType);
    setPayRate(item.payRate.toString());
    setHoursPerDay(item.hoursPerDay.toString());
    setDaysWorked(item.daysWorked.toString());
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => deleteDocAndRefresh(id) },
      ]
    );
  };

  const deleteDocAndRefresh = async (id) => {
    try {
      await deleteDoc(doc(db, 'schedules', id));
      fetchSchedules();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const payTypes = ['hourly', 'monthly', 'annually'];

  return (
    <ScrollView style={styles.scrollContainer}>
    
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Payroll & Scheduling</Text>

       
        <TextInput
          placeholder='Employee Name'
          style={styles.input}
          value={employeeName}
          onChangeText={setEmployeeName}
        />
        <TextInput
          placeholder='Employer Name'
          style={styles.input}
          value={employerName}
          onChangeText={setEmployerName}
        />
        <TextInput
          placeholder='Employer Designation'
          style={styles.input}
          value={employerDesignation}
          onChangeText={setEmployerDesignation}
        />
        <TextInput
          placeholder='Month/Year'
          style={styles.input}
          value={monthYear}
          onChangeText={setMonthYear}
        />

      
        <View style={styles.payTypeContainer}>
          {payTypes.map((pt) => (
            <TouchableOpacity
              key={pt}
              style={[styles.payTypeBtn, payType === pt && styles.payTypeSelected]}
              onPress={() => setPayType(pt)}
            >
              <Text style={styles.payTypeText}>{pt.charAt(0).toUpperCase() + pt.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder={`Rate (£) per ${payType}`}
          style={styles.input}
          value={payRate}
          onChangeText={setPayRate}
          keyboardType='numeric'
        />
        <TextInput
          placeholder='Hours per Day'
          style={styles.input}
          value={hoursPerDay}
          onChangeText={setHoursPerDay}
          keyboardType='numeric'
        />
        <TextInput
          placeholder='Days Worked'
          style={styles.input}
          value={daysWorked}
          onChangeText={setDaysWorked}
          keyboardType='numeric'
        />

        <Button title={editingId ? 'Update' : 'Submit'} onPress={handleAddOrUpdate} />

        {/* List with edit/delete */}
        {schedules.length > 0 && (
          <FlatList
            data={schedules}
            keyExtractor={(d) => d.id}
            renderItem={({ item }) => (
              <View style={styles.scheduleItem}>
                <Text>Name: {item.employeeName}</Text>
                <Text>Employer: {item.employerName}</Text>
                <Text>Designation: {item.employerDesignation}</Text>
                <Text>Month/Year: {item.monthYear}</Text>
                <Text>Rate: £{Number(item.payRate ?? 0).toFixed(2)} per {item.payType}</Text>
                <Text>Hours per Day: {Number(item.hoursPerDay ?? 0)}</Text>
                <Text>Days: {Number(item.daysWorked ?? 0)}</Text>
                <Text>Total: £{Number(item.totalEarned ?? 0).toFixed(2)}</Text>
                {isAdmin && (
                  <View style={styles.buttonsRow}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                      <Text style={styles.btnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                      <Text style={styles.btnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

// Your existing styles with these added or ensure they exist
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  businessName: { fontSize: 14, textAlign: 'center', marginBottom: 10 },

  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 6, borderRadius: 8, backgroundColor: '#fff' },

  payTypeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  payTypeBtn: { padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' },
  payTypeSelected: { backgroundColor: '#007bff' },
  payTypeText: { color: '#000' },

  sectionContainer: { marginVertical: 15 },

  scheduleItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: '#F44448',
    padding: 10,
    borderRadius: 4,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;