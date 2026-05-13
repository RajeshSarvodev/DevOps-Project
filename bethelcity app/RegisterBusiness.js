
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet,
  ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import Hospital from './Hospital';
import Vehicle from './Vehicle';
import Appointment from './Appointment';
import { Picker } from '@react-native-picker/picker';

const businessTypes = [
  'Retail', 'Service', 'Manufacturing', 'Education',
  'Finance', 'Technology', 'Other', 'Specify If Others',
];

const RegisterBusiness = () => {
  const [hospitals, setHospitals] = useState([]);
  const [showAppointment, setShowAppointment] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aboutBusiness, setAboutBusiness] = useState('');
  const [sizeOfBusiness, setSizeOfBusiness] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [editingHospitalId, setEditingHospitalId] = useState(null);

  const [selectedCardId, setSelectedCardId] = useState(null); 
  const [pendingAction, setPendingAction] = useState(null);   
  const [actionPassword, setActionPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'businesses'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setBusinesses(list);
      } catch {
        Alert.alert('Error', 'Failed to fetch businesses.');
      }
    })();
  }, []);

  const clearBusinessForm = () => {
    setBusinessName(''); setOwnerName(''); setContactNumber('');
    setEmail(''); setPassword(''); setConfirmPassword('');
    setAboutBusiness(''); setSizeOfBusiness('');
  };

  const generateId = () => Date.now().toString() + Math.floor(Math.random() * 1000);

  const handleBusinessSave = async () => {
    if (!businessName || !ownerName || !contactNumber || !email ||
        !password || !confirmPassword || !aboutBusiness) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    if (!sizeOfBusiness) {
      Alert.alert('Validation', 'Enter number of employees.');
      return;
    }

    setLoading(true);
    const data = {
      businessName, ownerName, contactNumber,
      email, password, aboutBusiness, sizeOfBusiness,
    };

    try {
      if (editingBusinessId) {
        await updateDoc(doc(db, 'businesses', editingBusinessId), data);
      } else {
        await addDoc(collection(db, 'businesses'), data);
      }
      const snap = await getDocs(collection(db, 'businesses'));
      setBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      clearBusinessForm();
      setShowBusinessForm(false);
      setEditingBusinessId(null);
    } catch {
      Alert.alert('Error', 'Something went wrong.');
    }
    setLoading(false);
  };

  const openVehicleForm = (veh = null) => {
    setEditingVehicleId(veh?.id || null);
    setShowVehicleForm(true);
  };

  const handleVehicleSave = (vehData) => {
    setVehicles(prev =>
      prev.some(v => v.id === vehData.id)
        ? prev.map(v => (v.id === vehData.id ? vehData : v))
        : [...prev, { ...vehData, id: vehData.id || generateId() }]
    );
    setShowVehicleForm(false);
    setEditingVehicleId(null);
  };

  const deleteVehicle = (id) =>
    setVehicles(prev => prev.filter(v => v.id !== id));

  const openHospitalForm = (h = null) => {
    setEditingHospitalId(h?.id || null);
    setShowHospitalForm(true);
  };

  const handleHospitalSave = (hospData) => {
    setHospitals(prev =>
      prev.some(h => h.id === hospData.id)
        ? prev.map(h => (h.id === hospData.id ? hospData : h))
        : [...prev, { ...hospData, id: hospData.id || generateId() }]
    );
    setShowHospitalForm(false);
    setEditingHospitalId(null);
  };

  const deleteHospital = (id) =>
    setHospitals(prev => prev.filter(h => h.id !== id));

 
  const promptPassword = (category, type, data) => {
    setPendingAction({ category, type, data });
    setActionPassword('');
    setShowPasswordInput(true);
  };

  const handlePasswordConfirm = () => {
    const { category, type, data } = pendingAction;
    if (!data) return;
    if (actionPassword !== data.password) {
      Alert.alert('Wrong password', 'Incorrect password.');
      return;
    }
    setActionLoading(true);

    if (category === 'business') {
      if (type === 'edit') {
        setBusinessName(data.businessName); setOwnerName(data.ownerName);
        setContactNumber(data.contactNumber); setEmail(data.email);
        setPassword(data.password); setConfirmPassword(data.password);
        setAboutBusiness(data.aboutBusiness);
        setSizeOfBusiness(data.sizeOfBusiness);
        setEditingBusinessId(data.id);
        setShowBusinessForm(true);
      } else {
        deleteDoc(doc(db, 'businesses', data.id)).then(async () => {
          const snap = await getDocs(collection(db, 'businesses'));
          setBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      }
    }

    if (category === 'vehicle') {
      if (type === 'edit') {
        openVehicleForm(data);
      } else {
        deleteVehicle(data.id);
      }
    }

    if (category === 'hospital') {
      if (type === 'edit') {
        openHospitalForm(data);
      } else {
        deleteHospital(data.id);
      }
    }

    setShowPasswordInput(false);
    setPendingAction(null);
    setActionLoading(false);
  };

  const CardActions = ({ item, cat }) => (
    <>
      <TouchableOpacity
        style={styles.showButtonsButton}
        onPress={() => setSelectedCardId(selectedCardId === item.id ? null : item.id)}
      >
        <Text style={styles.showButtonsButtonText}>Show/Hide Actions</Text>
      </TouchableOpacity>
      {selectedCardId === item.id && (
        <View style={styles.cardButtons}>
          <TouchableOpacity
            onPress={() => promptPassword(cat, 'edit', item)}
            style={styles.editButton}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => promptPassword(cat, 'delete', item)}
            style={styles.deleteButton}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderBusiness = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Business: {item.businessName}</Text>
      <Text style={styles.cardText}>Owner: {item.ownerName}</Text>
      <Text style={styles.cardText}>Contact: {item.contactNumber}</Text>
      <Text style={styles.cardText}>Email: {item.email}</Text>
      <Text style={styles.cardText}>Type: {item.aboutBusiness}</Text>
      <Text style={styles.cardText}>Employees: {item.sizeOfBusiness}</Text>
      <CardActions item={item} cat="business" />
    </View>
  );

  const renderVehicle = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Type: {item.vehicleType}</Text>
      <Text style={styles.cardText}>Number: {item.vehicleNumber}</Text>
      <Text style={styles.cardText}>Owner: {item.ownerName}</Text>
      <Text style={styles.cardText}>Brand: {item.brandName}</Text>
      <CardActions item={item} cat="vehicle" />
    </View>
  );

  const renderHospital = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Hospital: {item.hospitalName}</Text>
      <Text style={styles.cardText}>City: {item.city}</Text>
      <Text style={styles.cardText}>Contact: {item.contact}</Text>
      <CardActions item={item} cat="hospital" />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          <Image source={require('./pictures/Bethellogo.jpg')} style={styles.logo} />
          <Text style={styles.logoText}>Welcome to Bethel Business Portal</Text>
          <Text style={styles.description}>
            Register businesses, vehicles, hospitals & manage appointments.
          </Text>

          <TouchableOpacity
            onPress={() => setShowBusinessForm(p => !p)}
            style={styles.toggleFormButton}
          >
            <Text style={styles.buttonText}>
              {showBusinessForm ? 'Hide Form' : editingBusinessId ? 'Update Business' : 'Register Business'}
            </Text>
          </TouchableOpacity>

          {showBusinessForm && (
            <>
              <TextInput style={styles.input} placeholder="Business Name"
                value={businessName} onChangeText={setBusinessName} />
              <TextInput style={styles.input} placeholder="Owner Name"
                value={ownerName} onChangeText={setOwnerName} />
              <TextInput style={styles.input} placeholder="Contact Number"
                value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="Email"
                value={email} onChangeText={setEmail} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Set Password"
                value={password} onChangeText={setPassword} secureTextEntry />
              <TextInput style={styles.input} placeholder="Confirm Password"
                value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Type of Business *</Text>
                <Picker selectedValue={aboutBusiness} onValueChange={setAboutBusiness} style={styles.picker}>
                  <Picker.Item label="-- Select Business Type --" value="" />
                  {businessTypes.map(t => <Picker.Item key={t} label={t} value={t} />)}
                </Picker>
              </View>

              <TextInput style={styles.input} placeholder="Number of Employees *"
                value={sizeOfBusiness} onChangeText={setSizeOfBusiness} keyboardType="numeric" />

              <TouchableOpacity onPress={handleBusinessSave}
                style={styles.updateBusinessButton} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> :
                  <Text style={styles.buttonText}>
                    {editingBusinessId ? 'Update Business' : 'Save Business'}
                  </Text>}
              </TouchableOpacity>
            </>
          )}

       
          <TouchableOpacity onPress={() => openVehicleForm()} style={styles.toggleFormButton}>
            <Text style={styles.buttonText}>Register Vehicle</Text>
          </TouchableOpacity>
          {showVehicleForm && (
            <Vehicle
              existing={vehicles.find(v => v.id === editingVehicleId)}
              onSave={handleVehicleSave}
              onCancel={() => { setShowVehicleForm(false); setEditingVehicleId(null); }}
            />
          )}
          {vehicles.length > 0 && (
            <>
              <Text style={styles.subHeader}>Registered Vehicles</Text>
              <FlatList data={vehicles} renderItem={renderVehicle} keyExtractor={v => v.id} />
            </>
          )}

          <TouchableOpacity onPress={() => openHospitalForm()} style={styles.toggleFormButton}>
            <Text style={styles.buttonText}>Register Hospital</Text>
          </TouchableOpacity>
          {showHospitalForm && (
            <Hospital
              existing={hospitals.find(h => h.id === editingHospitalId)}
              onSave={handleHospitalSave}
              onCancel={() => { setShowHospitalForm(false); setEditingHospitalId(null); }}
            />
          )}
          {hospitals.length > 0 && (
            <>
              <Text style={styles.subHeader}>Registered Hospitals</Text>
              <FlatList data={hospitals} renderItem={renderHospital} keyExtractor={h => h.id} />
            </>
          )}

          <Text style={styles.subHeader}>Registered Businesses</Text>
          {businesses.length === 0
            ? <Text style={{ textAlign: 'center', marginVertical: 10 }}>No businesses registered yet.</Text>
            : <FlatList data={businesses} renderItem={renderBusiness} keyExtractor={b => b.id} />}

          <TouchableOpacity style={styles.toggleFormButton} onPress={() => setShowAppointment(true)}>
            <Text style={styles.buttonText}>Book Doctor Appointment</Text>
          </TouchableOpacity>
          {showAppointment && (
            <View style={styles.appointmentOverlay}>
              <Appointment onClose={() => setShowAppointment(false)} />
            </View>
          )}

          
          {showPasswordInput && (
            <View style={styles.passwordOverlay}>
              <View style={styles.passwordBox}>
                <Text style={styles.subHeader}>Enter Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={actionPassword}
                  onChangeText={setActionPassword}
                />
                <TouchableOpacity onPress={handlePasswordConfirm}
                  style={styles.updateBusinessButton} disabled={actionLoading}>
                  {actionLoading ? <ActivityIndicator color="#fff" /> :
                    <Text style={styles.buttonText}>Confirm</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPasswordInput(false)} style={styles.toggleFormButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#f4f4f4', flexGrow: 1 },
  scrollContainer: { flexGrow: 1 },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 10 },
  logoText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  description: { textAlign: 'center', marginBottom: 20 },
  toggleFormButton: {
    backgroundColor: '#4a90e2', padding: 12, borderRadius: 8, marginVertical: 8,
  },
  updateBusinessButton: {
    backgroundColor: '#2ecc71', padding: 12, borderRadius: 8, marginVertical: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  input: {
    backgroundColor: '#fff', padding: 10, borderRadius: 6,
    borderWidth: 1, borderColor: '#ddd', marginBottom: 10,
  },
  pickerContainer: { marginBottom: 10 },
  pickerLabel: { fontWeight: 'bold', marginBottom: 5 },
  picker: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 6 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  card: {
    backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10,
    borderWidth: 1, borderColor: '#ccc',
  },
  cardText: { marginBottom: 4 },
  showButtonsButton: {
    marginTop: 6, backgroundColor: '#3498db', padding: 6, borderRadius: 6,
  },
  showButtonsButtonText: { color: '#fff', textAlign: 'center' },
  cardButtons: {
    flexDirection: 'row', justifyContent: 'space-around', marginTop: 8,
  },
  editButton: {
    backgroundColor: '#f1c40f', padding: 8, borderRadius: 6, flex: 0.45,
  },
  deleteButton: {
    backgroundColor: '#e74c3c', padding: 8, borderRadius: 6, flex: 0.45,
  },
  appointmentOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
  },
  passwordOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  passwordBox: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '80%' },
});

export default RegisterBusiness;
