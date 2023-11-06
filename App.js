import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginUser from './loginuser';
import Ratings from './ratings';
import { StyleSheet, Button, Text } from 'react-native';
import Logout from './logout';
import CreateUser from './createuser';
import AddNewRating from './addnewrating';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import UpdateRating from './update';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null); // Initialize user state

  useEffect(() => {
    // Retrieve the user's name from AsyncStorage
    AsyncStorage.getItem('user')
      .then((value) => {
        if (value) {
          setUser(value);
        }
      })
      .catch((error) => {
        console.error('Error loading user:', error);
      });
  }, []); // Fetch the user data on app start

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginUser} />
        <Stack.Screen
          name="Ratings"
          component={Ratings}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                title="Log Out"
                onPress={() => navigation.navigate('Logout')}
              />
            ),
            headerBackVisible: false, // Hide the back button
          })}
        />
        <Stack.Screen
          name="Add New Rating"
          component={AddNewRating}
        />
        <Stack.Screen
          name="Logout"
          component={Logout}
          options={{
            headerShown: false, // Hide the header for the Logout screen
          }}
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUser}
        />
        <Stack.Screen
          name="Update Rating"
          component={UpdateRating}
        />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
