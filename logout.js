import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Clear the user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      // Navigate back to the login screen (you can replace 'Login' with your actual screen name)
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCancel = () => {
    navigation.navigate('Ratings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Are you sure you want to log out?</Text>
      
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutbutton}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCancel} style={styles.buttonContainer}>
          <Text style={styles.cancelbutton}>Cancel</Text>
        </TouchableOpacity>

    </View>
  );
};

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
  }
});

export default Logout;
