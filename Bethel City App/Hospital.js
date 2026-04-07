import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, Modal
} from 'react-native';

const Hospital = ({ onSave, onCancel, existingHospital }) => {
 
  const [hospitalName, setHospitalName] = useState(existingHospital?.hospitalName || '');
  const [location, setLocation] = useState(existingHospital?.location || '');
  const [contactNumber, setContactNumber] = useState(existingHospital?.contactNumber || '');
  const [countryCode, setCountryCode] = useState(existingHospital?.countryCode || '+1');
  const [email, setEmail] = useState(existingHospital?.email || '');
  const [ownerName, setOwnerName] = useState(existingHospital?.ownerName || '');
  const [treatmentType, setTreatmentType] = useState(existingHospital?.treatmentType || '');
  const [numberOfBranches, setNumberOfBranches] = useState(existingHospital?.numberOfBranches || '');
  const [additionalInfo, setAdditionalInfo] = useState(existingHospital?.additionalInfo || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);

  const [patients, setPatients] = useState(existingHospital?.patients || []);
  const [staffs, setStaffs] = useState(existingHospital?.staffs || []);

  const [patientForm, setPatientForm] = useState({
    name: '', contact: '', email: '', password: '', treatment: '', schedule: ''
  });

  const [staffForm, setStaffForm] = useState({
    name: '', email: '', role: '', password: '', hospitalName: '', hospitalLocation: ''
  });

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [loginType, setLoginType] = useState(null); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const generateId = () => Date.now().toString() + Math.floor(Math.random() * 1000).toString();

  const handleSave = () => {
    if (!hospitalName || !location || !contactNumber || !countryCode || !email || !ownerName ||
      !treatmentType || !numberOfBranches || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    const hospitalData = {
      id: existingHospital?.id || generateId(),
      hospitalName, location, contactNumber, countryCode, email, ownerName,
      treatmentType, numberOfBranches, additionalInfo, password,
      patients, staffs
    };
    onSave(hospitalData);
  };

  const addPatient = () => {
    const { name, contact, email, password, treatment, schedule } = patientForm;
    if (!name || !contact || !email || !password || !treatment || !schedule) {
      Alert.alert('Validation Error', 'Please fill all patient fields.');
      return;
    }
    setPatients([...patients, { id: generateId(), ...patientForm }]);
    setPatientForm({ name: '', contact: '', email: '', password: '', treatment: '', schedule: '' });
    setShowPatientForm(false);
  };

  const addStaff = () => {
    const { name, email, role, password, hospitalName: hName, hospitalLocation } = staffForm;
    if (!name || !email || !role || !password || !hName || !hospitalLocation) {
      Alert.alert('Validation Error', 'Please fill all staff fields.');
      return;
    }
    setStaffs([...staffs, { id: generateId(), ...staffForm }]);
    setStaffForm({ name: '', email: '', role: '', password: '', hospitalName: '', hospitalLocation: '' });
    setShowStaffForm(false);
  };

  const handleSecureAction = (type, id, list, setList) => {
    let target = list.find(item => item.id === id);
    if (!target) return;

    Alert.prompt('Enter Email', 'To proceed with this action', (enteredEmail) => {
      if (enteredEmail !== target.email) {
        Alert.alert('Invalid Credentials', 'Email does not match.');
        return;
      }

      Alert.prompt('Enter Password', 'Confirm your password', (enteredPassword) => {
        if (enteredPassword === target.password) {
          if (type === 'delete') {
            setList(list.filter(item => item.id !== id));
            Alert.alert('Success', `${type} successful`);
          } else {
            Alert.alert('Info', 'Edit functionality not implemented yet.');
          }
        } else {
          Alert.alert('Invalid Credentials', 'Incorrect password.');
        }
      });
    });
  };

  const openLogin = (type) => {
    setLoginType(type);
    setLoginEmail('');
    setLoginPassword('');
    setLoggedInUser(null);
    setLoginModalVisible(true);
  };

  const handleLogin = () => {
    let userList = loginType === 'patient' ? patients : staffs;
    let foundUser = userList.find(u => u.email === loginEmail && u.password === loginPassword);
    if (!foundUser) {
      Alert.alert('Login Failed', 'Invalid email or password');
      return;
    }
    setLoggedInUser(foundUser);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setLoginModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>

      <Text style={styles.header}>Register Hospital</Text>

      <TextInput style={styles.input} placeholder="Hospital Name" value={hospitalName} onChangeText={setHospitalName} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />

      <View style={styles.contactRow}>
        <TextInput style={[styles.input, styles.codeField]} placeholder="Code" value={countryCode} onChangeText={setCountryCode} />
        <TextInput style={[styles.input, styles.contactField]} placeholder="Contact" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
      </View>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Owner Name" value={ownerName} onChangeText={setOwnerName} />
      <TextInput style={styles.input} placeholder="Type of Treatment" value={treatmentType} onChangeText={setTreatmentType} />
      <TextInput style={styles.input} placeholder="Number of Branches" value={numberOfBranches} onChangeText={setNumberOfBranches} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Additional Information" value={additionalInfo} onChangeText={setAdditionalInfo} multiline />

      <TextInput style={styles.input} placeholder="Set Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>Save Hospital</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.subHeader}>Patients</Text>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setShowPatientForm(!showPatientForm)}>
          <Text style={styles.toggleText}>{showPatientForm ? 'Cancel Add Patient' : 'Add Patient'}</Text>
        </TouchableOpacity>

        {showPatientForm && (
          <View style={styles.subForm}>
            <TextInput style={styles.input} placeholder="Full Name" value={patientForm.name} onChangeText={t => setPatientForm({ ...patientForm, name: t })} />
            <TextInput style={styles.input} placeholder="Contact" value={patientForm.contact} onChangeText={t => setPatientForm({ ...patientForm, contact: t })} />
            <TextInput style={styles.input} placeholder="Email" value={patientForm.email} onChangeText={t => setPatientForm({ ...patientForm, email: t })} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={patientForm.password} onChangeText={t => setPatientForm({ ...patientForm, password: t })} />
            <TextInput style={styles.input} placeholder="Treatment" value={patientForm.treatment} onChangeText={t => setPatientForm({ ...patientForm, treatment: t })} />
            <TextInput style={styles.input} placeholder="Schedule" value={patientForm.schedule} onChangeText={t => setPatientForm({ ...patientForm, schedule: t })} />
            <TouchableOpacity style={styles.button} onPress={addPatient}><Text style={styles.buttonText}>Save Patient</Text></TouchableOpacity>
          </View>
        )}

        {patients.map(p => (
          <View key={p.id} style={styles.itemRow}>
            <Text style={{ flex: 1 }}>{p.name} - Treatment: {p.treatment}, Schedule: {p.schedule}</Text>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleSecureAction('delete', p.id, patients, setPatients)}>
              <Text style={styles.smallButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleSecureAction('edit', p.id, patients, setPatients)}>
              <Text style={styles.smallButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.loginButton} onPress={() => openLogin('patient')}>
          <Text style={styles.loginText}>Patient Login</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.subHeader}>Staff</Text>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setShowStaffForm(!showStaffForm)}>
          <Text style={styles.toggleText}>{showStaffForm ? 'Cancel Add Staff' : 'Add Staff'}</Text>
        </TouchableOpacity>

        {showStaffForm && (
          <View style={styles.subForm}>
            <TextInput style={styles.input} placeholder="Full Name" value={staffForm.name} onChangeText={t => setStaffForm({ ...staffForm, name: t })} />
            <TextInput style={styles.input} placeholder="Email" value={staffForm.email} onChangeText={t => setStaffForm({ ...staffForm, email: t })} />
            <TextInput style={styles.input} placeholder="Role" value={staffForm.role} onChangeText={t => setStaffForm({ ...staffForm, role: t })} />
            {/* Removed the extra empty <Text */}
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={staffForm.password} onChangeText={t => setStaffForm({ ...staffForm, password: t })} />
            <TextInput style={styles.input} placeholder="Hospital Name" value={staffForm.hospitalName} onChangeText={t => setStaffForm({ ...staffForm, hospitalName: t })} />
            <TextInput style={styles.input} placeholder="Hospital Location" value={staffForm.hospitalLocation} onChangeText={t => setStaffForm({ ...staffForm, hospitalLocation: t })} />
            <TouchableOpacity style={styles.button} onPress={addStaff}><Text style={styles.buttonText}>Save Staff</Text></TouchableOpacity>
          </View>
        )}

        {staffs.map(s => (
          <View key={s.id} style={styles.itemRow}>
            <Text style={{ flex: 1 }}>{s.name} - Role: {s.role}, Hospital: {s.hospitalName}</Text>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleSecureAction('delete', s.id, staffs, setStaffs)}>
              <Text style={styles.smallButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleSecureAction('edit', s.id, staffs, setStaffs)}>
              <Text style={styles.smallButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.loginButton} onPress={() => openLogin('staff')}>
          <Text style={styles.loginText}>Staff Login</Text>
        </TouchableOpacity>
      </View>

      {/* Login Modal */}
      <Modal visible={loginModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!loggedInUser ? (
              <>
                <Text style={styles.modalTitle}>{loginType === 'patient' ? 'Patient' : 'Staff'} Login</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={loginPassword}
                  secureTextEntry
                  onChangeText={setLoginPassword}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => setLoginModalVisible(false)}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Welcome, {loggedInUser.name}</Text>
                <Text>Email: {loggedInUser.email}</Text>
                {loginType === 'patient' && (
                  <>
                    <Text>Treatment: {loggedInUser.treatment}</Text>
                    <Text>Schedule: {loggedInUser.schedule}</Text>
                  </>
                )}
                {loginType === 'staff' && (
                  <>
                    <Text>Role: {loggedInUser.role}</Text>
                    <Text>Hospital: {loggedInUser.hospitalName}</Text>
                    <Text>Location: {loggedInUser.hospitalLocation}</Text>
                  </>
                )}
                <TouchableOpacity style={styles.button} onPress={handleLogout}><Text style={styles.buttonText}>Logout</Text></TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#f2f2f2', flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  subHeader: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  input: {
    backgroundColor: '#fff', padding: 10, borderRadius: 6, marginBottom: 10,
    borderWidth: 1, borderColor: '#ccc'
  },
  contactRow: { flexDirection: 'row', marginBottom: 10 },
  codeField: { flex: 1, marginRight: 5 },
  contactField: { flex: 3 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  button: { backgroundColor: '#4a90e2', padding: 12, borderRadius: 6, minWidth: 100, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  toggleButton: { backgroundColor: '#ddd', padding: 8, borderRadius: 5, marginBottom: 10, alignSelf: 'flex-start' },
  toggleText: { color: '#333', fontWeight: '600' },
  subForm: { backgroundColor: '#eaeaea', padding: 10, borderRadius: 6, marginBottom: 20 },
  itemRow: {
    flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginBottom: 8, borderRadius: 6,
    alignItems: 'center'
  },
  smallButton: {
    backgroundColor: '#e74c3c', padding: 6, borderRadius: 5, marginLeft: 8
  },
  smallButtonText: { color: '#fff', fontWeight: '600' },
  loginButton: { marginTop: 10, alignSelf: 'center' },
  loginText: { color: '#4a90e2', fontWeight: '700', textDecorationLine: 'underline' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center',
  },
});

export default Hospital;