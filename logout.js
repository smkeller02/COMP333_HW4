import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Logout component that checks if user wants to logout and if so, resets AsyncStorage and sends user to login screen
const Logout = () => {
  const [user, setUser] = useState(null); // Initialize user state
  const navigation = useNavigation();

    // Retrieve the user's name from AsyncStorage
    AsyncStorage.getItem('user')
    .then((value) => {
        if (value) {
            setUser(value);
        }
    })
    .catch((error) => {
        console.error(error);
    });

  // Function to handle the logout process
  const handleLogout = async () => {
    try {
      // Clear the user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      // Navigate back to the login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Function to handle canceling the logout process and navigate back to the 'Ratings' screen
  const handleCancel = () => {
    navigation.navigate('Ratings');
  };

  return (
    <View style={styles.container}>
      {/* message asking if the user really wants to log out */}
      <Text style={styles.text}>Are you sure you want to log out {user}?</Text>
      
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutbutton}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCancel} style={styles.buttonContainer}>
          <Text style={styles.cancelbutton}>Cancel</Text>
      </TouchableOpacity>

    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C27A4',
  },
  logoutbutton: {
    paddingTop: 20,
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '400'
  },
  cancelbutton : {
    paddingTop: 20,
    color: '#FFFFFF',
    fontSize: 22
  },
  text: {
    fontSize: 23,
    fontWeight: '700',
    paddingBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center'
  }
});

export default Logout;
