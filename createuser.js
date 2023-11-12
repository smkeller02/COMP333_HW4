import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Creates a new user and enters into database
function CreateUser() {
  // Set up states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  // handles navigation to the login screen for existing users
  const handleLogin = () => {
    navigation.navigate('Login'); // Navigate to the login screen
  };

  useEffect(() => {
    // Load the username from AsyncStorage
    loadUsername();
  }, []);

  // load username from asyncstorage
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

  // handles password checking, if passwords match, send user inputs to backend to add to database
  const handleSubmit = async () => {
    if (password !== password2) {
      setMessage('Passwords don\'t match');
      return;
    }

    try {
      // Send a POST request to create a new user
      // CHANGE IP ADDRESS TO YOUR SPECIFIC
      const response = await fetch('http://129.133.188.213/COMP333_HW4_backend/index.php/createuser', {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (response.status === 200) {
        // Successful sign-up
        setUsername('');
        setPassword('');
        setPassword2('');
        setMessage('');
        // Save the username to AsyncStorage
        await AsyncStorage.setItem('user', username);
        // navigate to main screen
        navigation.navigate('Ratings');
      } else if (response.status === 400) {
        // Bad HTTP response
        setMessage(responseData.error);
      } else {
        setMessage('Error: ' + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* welcome message */}
      <Text style={styles.text}>Welcome! Create an account: </Text>
      
      {/* Input fields */}
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
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        value={password2}
        placeholder="Re-type Password"
        onChangeText={(text) => setPassword2(text)}
        secureTextEntry={true}
      />

      {/* Triggers the sign-up process when pressed */}
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.loginbutton}>Sign Up</Text>
      </TouchableOpacity>

      {/* display and error messages if they come up */}
      <View>
        <Text style={styles.message}>{message}</Text>
      </View>

      {/* login navigation for users who already have an account */}
      <Text style={styles.logintext}>Already have an account?</Text>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginsend}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styling
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
  loginbutton: {
    color: '#0C27A4',
    fontSize: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    fontWeight: '500'
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingBottom: 20
  },
  logintext: {
    color: '#FFFFFF',
    fontSize: 18,
    paddingTop: 20,
    paddingBottom: 15
  },
  loginsend: {
    color: '#0C27A4',
    fontSize: 18,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    fontWeight: '500'
  }
});

export default CreateUser;
