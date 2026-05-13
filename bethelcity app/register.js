import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const Register = () => {
  const [businesses, setBusinesses] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const businessSnap = await getDocs(collection(db, 'businesses'));
      setBusinesses(businessSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const hospitalSnap = await getDocs(collection(db, 'hospitals'));
      setHospitals(hospitalSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const vehicleSnap = await getDocs(collection(db, 'vehicles'));
      setVehicles(vehicleSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAdminLogin = () => {
    if (username === 'admin' && password === 'admin@123') {
      setIsAdmin(true);
      setShowLoginForm(false);
      Alert.alert('Success', 'Logged in as Admin');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setUsername('');
    setPassword('');
    Alert.alert('Logged Out', 'Admin has been logged out.');
  };

  const handleDelete = async (id, type) => {
    const collectionName =
      type === 'business' ? 'businesses' : type === 'hospital' ? 'hospitals' : 'vehicles';

    Alert.alert('Confirm Delete', `Are you sure you want to delete this ${type}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, collectionName, id));
            fetchAllData();
            Alert.alert('Deleted', `${type} entry deleted.`);
          } catch (error) {
            Alert.alert('Error', `Failed to delete ${type}.`);
          }
        },
      },
    ]);
  };

  const renderSection = (title, data, type) => (
    <View>
      <Text style={styles.sectionHeader}>{title}</Text>
      {data.length === 0 ? (
        <Text style={styles.noDataText}>No {type} registered yet.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {type === 'business' && (
                <>
                  <Text style={styles.cardText}>Business: {item.businessName}</Text>
                  <Text style={styles.cardText}>Owner: {item.ownerName}</Text>
                  <Text style={styles.cardText}>Contact: {item.contactNumber}</Text>
                  <Text style={styles.cardText}>Email: {item.email}</Text>
                  <Text style={styles.cardText}>About: {item.aboutBusiness}</Text>
                </>
              )}
              {type === 'hospital' && (
                <>
                  <Text style={styles.cardText}>Hospital Name: {item.hospitalName}</Text>
                  <Text style={styles.cardText}>Treatment: {item.treatmentType}</Text>
                  <Text style={styles.cardText}>Contact: {item.contactNumber}</Text>
                  <Text style={styles.cardText}>Email: {item.email}</Text>
                </>
              )}
              {type === 'vehicle' && (
                <>
                  <Text style={styles.cardText}>Vehicle Type: {item.vehicleType}</Text>
                  <Text style={styles.cardText}>Owner: {item.ownerName}</Text>
                  <Text style={styles.cardText}>Contact: {item.contactNumber}</Text>
                  <Text style={styles.cardText}>Email: {item.email}</Text>
                </>
              )}
              {isAdmin && (
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, type)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );

  const handleContactUs = () => {
    Alert.alert(
      'Contact Us',
      'Email: support@bethelcommunity.org\nPhone (UK): +44 7523 456789'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('./pictures/Bethellogo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Community Registrations</Text>
        <Text style={styles.description}>
          This page lists all businesses, hospitals, and vehicles registered in the Bethel community.
          Only admin users may manage data.
        </Text>

        {isAdmin && <Button title="Logout Admin" color="#d9534f" onPress={handleLogout} />}
        {!isAdmin && !showLoginForm && (
          <Button title="Admin Login" onPress={() => setShowLoginForm(true)} />
        )}

        {showLoginForm && !isAdmin && (
          <View style={styles.loginForm}>
            <Text style={styles.loginTitle}>Admin Login</Text>
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.loginButtons}>
              <Button title="Login" onPress={handleAdminLogin} />
              <View style={{ width: 10 }} />
              <Button title="Cancel" color="gray" onPress={() => setShowLoginForm(false)} />
            </View>
          </View>
        )}

        {renderSection('Registered Businesses', businesses, 'business')}
        {renderSection('Registered Hospitals', hospitals, 'hospital')}
        {renderSection('Registered Vehicles', vehicles, 'vehicle')}

        {/* Contact Us Button */}
        <View style={styles.contactContainer}>
          <Button title="Contact Us" onPress={handleContactUs} color="#0275d8" />
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 40 },
  container: { padding: 20, paddingTop: 60, backgroundColor: '#f9f9f9' },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'left',
    color: '#2c3e50',
  },
  loginForm: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#e7f0fe',
  },
  cardText: { fontSize: 16, marginBottom: 4 },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contactContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
});
