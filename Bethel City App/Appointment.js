
import React, { useState } from 'react'
import {  View,  Text,  TextInput,  TouchableOpacity,  StyleSheet,  Alert,} from 'react-native'

const Appointment = ({ onClose }) => {
  const [name, setName] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')

  const handleBook = () => {
    if (!name || !doctor || !date || !time || !reason) {
      Alert.alert('Validation', 'Please fill all fields.')
      return
    }
    Alert.alert(
      'Booked!',
      `Thank you, ${name}. Your appointment with Dr. ${doctor} on ${date} at ${time} is confirmed.`
    )
    onClose()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Appointment</Text>
      <TextInput
        placeholder='Your Name'
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder='Doctor’s Name'
        style={styles.input}
        value={doctor}
        onChangeText={setDoctor}
      />
      <TextInput
        placeholder='Date (YYYY-MM-DD)'
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder='Time (HH:MM)'
        style={styles.input}
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        placeholder='Reason'
        style={styles.input}
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity style={styles.button} onPress={handleBook}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancel} onPress={onClose}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 8,
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  cancel: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: '600' },
  cancelText: { color: 'white', fontWeight: '600' },
})

export default Appointment