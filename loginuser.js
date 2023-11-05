import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation(); // Get the navigation object

  const handleSignUp = () => {
    navigation.navigate('CreateUser'); // Navigate to the 'SignUp' screen
  };

  useEffect(() => {
    // Load the username from AsyncStorage
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const usernameInput = await AsyncStorage.getItem('user');
      if (usernameInput !== null) {
        setUsername(usernameInput);
      }
    } catch (error) {
      console.error('Error getting username:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // CHANGE IP ADDRESS TO YOUR SPECIFIC
      const response = await fetch('http://129.133.188.213/COMP333_HW4_backend/index.php/loginuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const responseData = await response.json();

      if (response.status === 200) {
        setUsername('');
        setPassword('');
        setMessage('');
        // Save the username to AsyncStorage
        await AsyncStorage.setItem('user', username);
        navigation.navigate('Ratings'); // navigate to ratings main page
      } else if (response.status === 400) {
        setMessage(responseData.error);
      } else {
        setMessage('Something went wrong');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <TextInput
        style={styles.input}
        value={username}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true} // To hide the password
      />
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.button}>Login</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signuptext}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C27A4',
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#FFFFFF'
  },
  message: {
    marginTop: 10,
    color: '#FF6B6B',
    fontSize: 18
  },
  welcomeText: {
    fontSize: 25,
    paddingBottom: 20,
    color: '#FFFFFF',
  },
  button: {
    color: '#FFFFFF',
    fontSize: 20
  },
  signuptext: {
    color: '#FFFFFF',
    fontSize: 18,
    paddingTop: 20
  }
});
