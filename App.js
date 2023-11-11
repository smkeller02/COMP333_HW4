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
import ViewRating from './view';
import DeleteRating from './delete';

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
    // main navigation container for the app
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Defining screens and their components */}
        <Stack.Screen 
          name="Login" 
          component={LoginUser}
          options={{
            headerShown: false
          }}
           />
        <Stack.Screen
          name="Ratings"
          component={Ratings}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Add New Rating"
          component={AddNewRating}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Logout"
          component={Logout}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUser}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Update Rating"
          component={UpdateRating}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="View Rating"
          component={ViewRating}
          options={{
            headerShown: false, 
          }}
        />
        <Stack.Screen
          name="Delete Rating"
          component={DeleteRating}
          options={{
            headerShown: false, 
          }}
        />
    </Stack.Navigator>
    </NavigationContainer>
  );
}
