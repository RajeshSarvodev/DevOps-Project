import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
   
      <Text style={styles.heading}>Welcome to Bethel</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
    
        <View style={styles.header}>
          <Image source={require('./pictures/Bethellogo.jpg')} style={styles.image} />
          <Text style={styles.text}>This is the official portal for managing business, health, and community services in Bethel.</Text>
          <Text style={styles.text}>Explore the city's services and opportunities below.</Text>
        </View>

        <View style={styles.box}>
          <Image source={require('./pictures/Registerbusiness.jpg')} style={styles.boxImage} />
          <Text style={styles.boxText}>Business Registration</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegisterBusiness')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.separatorText}>Get your business listed in Bethel today.</Text>

        <View style={styles.box}>
          <Image source={require('./pictures/Hospitals.jpg')} style={styles.boxImage} />
          <Text style={styles.boxText}>Hospital Services</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegisterBusiness')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.separatorText}>Provide essential healthcare for the city.</Text>

        <View style={styles.box}>
          <Image source={require('./pictures/posts.jpg')} style={styles.boxImage} />
          <Text style={styles.boxText}>Community Events</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Posts')}>
            <Text style={styles.buttonText}>View Events</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.separatorText}>Join or host events that build community.</Text>

        <View style={styles.box}>
          <Image source={require('./pictures/Dashboard.jpg')} style={styles.boxImage} />
          <Text style={styles.boxText}>City Dashboard</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Performance')}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0077cc',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 280,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  boxImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  boxText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#0077cc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  separatorText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#555',
  },
});
