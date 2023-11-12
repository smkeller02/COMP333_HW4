import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Deletes a given rating
function DeleteRating({ route }) {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [user, setUser] = useState(null); // Initialize user state
  // Extract parameters from route
  const { ratingId, onDataChanged } = route.params;

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
  
  // Function to deal with deleting a rating from the database
  const handleDelete = async () => {
    try {
      const username = await AsyncStorage.getItem("user");
      // Send DELETE request to backend
      // CHANGE IP ADDRESS TO YOUR SPECIFIC
      const response = await fetch("http://129.133.188.213/COMP333_HW4_backend/index.php/deleterating", {
        method: "DELETE",
        body: JSON.stringify({
          "username": username,
          "id": ratingId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const responseJson = await response.json();

      if (response.status === 200) {
        // If good HTTP response, notify to refresh, and navigate back to main screen
        setMessage("Rating Deleted");
        onDataChanged();
        navigation.navigate('Ratings');
      } else if (response.status === 400) {
        // If bad HTTP response, display backend error
        setMessage(responseJson.error);
      } else { 
        setMessage("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle canceling the logout process and navigate back to the 'Ratings' screen
  const handleCancel = () => {
    navigation.navigate('Ratings');
  };

  return (
    <View style={styles.container}>
      {/* Display delete form */}
      {showForm ? (
        <>
          <Text style={styles.deleteTitle}>Username: {user}</Text>
          <Text style={styles.deleteTitle}>Are you sure you want to delete this rating?</Text>
          
          {/* Delete button, when pressed initiates backend delete process, sends user to main */}
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deletetext}>Delete</Text>
          </TouchableOpacity>  

          {/* cancel button, when pressed sends user to back main */}
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.canceltext}>Cancel</Text>
          </TouchableOpacity>
          
          {/* display any message if applicable */}
          {message ? <Text>{message}</Text> : null}
        </>
      ) : null}
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C27A4'
  },
  deleteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingBottom: 20
  },
  canceltext: {
    color: '#FFFFFF',
    fontSize: 17,
    paddingTop: 20
  },
  deletetext: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default DeleteRating;
