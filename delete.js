import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Deletes a given rating
function DeleteRating({ ratingId, onDataChanged }) {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

  const handleDelete = async () => {
    try {
      const username = await AsyncStorage.getItem("user");
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
        setMessage("Rating Deleted");
        onDataChanged();
        navigation.navigate('Ratings');
      } else if (response.status === 400) {
        setMessage(responseJson.error);
      } else { 
        setMessage("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    // Hide the form when the Cancel button is clicked
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      {showForm ? (
        <>
          <Text>Are you sure you want to delete this rating?</Text>
          <Button title="Delete" onPress={handleDelete} />
          <Button title="Cancel" onPress={handleCancel} />
          {message ? <Text>{message}</Text> : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeleteRating;
