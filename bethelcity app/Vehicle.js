import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Vehicle = ({ onSave, onCancel, onEdit, onDelete, existingVehicle }) => {
  const [vehicleType, setVehicleType] = useState(existingVehicle?.vehicleType || '');
  const [vehicleNumber, setVehicleNumber] = useState(existingVehicle?.vehicleNumber || '');
  const [ownerName, setOwnerName] = useState(existingVehicle?.ownerName || '');
  const [brandName, setBrandName] = useState(existingVehicle?.brandName || '');
  const [age, setAge] = useState(existingVehicle?.age || '');
  const [city, setCity] = useState(existingVehicle?.city || '');
  const [contactNumber, setContactNumber] = useState(existingVehicle?.contactNumber || '');
  const [countryCode, setCountryCode] = useState(existingVehicle?.countryCode || '+1');
  const [email, setEmail] = useState(existingVehicle?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [authPassword, setAuthPassword] = useState('');

  const generateId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  };

  const handleSave = () => {
    if (
      !vehicleType || !vehicleNumber || !ownerName || !brandName || !age || !city ||
      !contactNumber || !countryCode || !email || !password || !confirmPassword
    ) {
      alert('Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const vehicleData = {
      id: existingVehicle?.id || generateId(),
      vehicleType,
      vehicleNumber,
      ownerName,
      brandName,
      age,
      city,
      contactNumber,
      countryCode,
      email,
      password,
    };

    onSave(vehicleData);
  };

  const handleEdit = () => {
    if (authPassword !== existingVehicle?.password) {
      alert('Incorrect password!');
      return;
    }
    onEdit && onEdit(existingVehicle?.id);
  };

  const handleDelete = () => {
    if (authPassword !== existingVehicle?.password) {
      alert('Incorrect password!');
      return;
    }
    onDelete && onDelete(existingVehicle?.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register Vehicle</Text>

      <TextInput style={styles.input} placeholder="Vehicle Type" value={vehicleType} onChangeText={setVehicleType} />
      <TextInput style={styles.input} placeholder="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} />
      <TextInput style={styles.input} placeholder="Owner Name" value={ownerName} onChangeText={setOwnerName} />
      <TextInput style={styles.input} placeholder="Brand Name" value={brandName} onChangeText={setBrandName} />
      <TextInput style={styles.input} placeholder="Age of Vehicle" value={age} onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />

    
      <View style={styles.contactRow}>
        <TextInput
          style={[styles.input, styles.countryCode]}
          placeholder="Country Code"
          value={countryCode}
          onChangeText={setCountryCode}
        />
        <TextInput
          style={[styles.input, styles.contactNumber]}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Set Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowActions(!showActions)}>
        <Text style={{ color: '#3498db', textAlign: 'center' }}>{showActions ? 'Hide Options' : 'Show Edit/Delete'}</Text>
      </TouchableOpacity>

      {showActions && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Password to Proceed"
            secureTextEntry
            value={authPassword}
            onChangeText={setAuthPassword}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonRed} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', borderRadius: 8, marginBottom: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#f0f0f0', marginBottom: 10, padding: 10, borderRadius: 4 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  countryCode: { width: '30%' },
  contactNumber: { width: '65%' },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  button: { backgroundColor: '#3498db', padding: 10, borderRadius: 4, width: '48%' },
  buttonRed: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 4, width: '48%' },
  buttonText: { color: '#fff', textAlign: 'center' },
  toggleButton: { marginTop: 10, padding: 10 },
});

export default Vehicle;
