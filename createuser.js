import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation(); // Get the navigation object


  const handleLogin = () => {
    navigation.navigate('Login'); // Navigate to the 'SignUp' screen
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
    if (password !== password2) {
      setMessage('Passwords don\'t match');
      return;
    }

    try {
      // Send a POST request to create a new user
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
        // Good HTTP response
        setUsername('');
        setPassword('');
        setPassword2('');
        setMessage('');
        //onCreateSuccess(); // Trigger the callback for successful sign-up
        // Save the username to AsyncStorage
        await AsyncStorage.setItem('user', username);
        navigation.navigate('Ratings'); // Use navigation prop to navigate
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
      <Text style={styles.text}>Welcome! Create an account: </Text>
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
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.text}>Sign Up</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.logintext}>Login</Text>
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
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingBottom: 20
  },
  logintext: {
    color: '#FFFFFF',
    fontSize: 18,
    paddingTop: 20
  }
});

export default CreateUser;
