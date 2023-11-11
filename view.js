import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";

// Displays a single ratings information
function ViewRating() {
  const [user, setUser] = useState(null); // Initialize user state
  const navigation = useNavigation();

  const handleBack = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };

  const route = useRoute();
  const ratingData = route.params?.ratingData || {};

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

  return (
    <View style={styles.container}>
      {/* display username at top of screen */}
      <Text style={styles.userText}>Username: {user}</Text>

      <Text>Title: {ratingData.song}</Text>
      <Text>Artist: {ratingData.artist}</Text>
      <Text>Username: {ratingData.username}</Text>
      <Text>Rating: {ratingData.rating}</Text>
      <Button title="Back" onPress={handleBack} />
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

export default ViewRating;
