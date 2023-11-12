import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';

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

  // Function for creating star icons for rating
  const renderStars = (rating) => {
    const maxRating = 5;

    // Create an array of star icons
    return (
      <View style={styles.starContainer}>
        {[...Array(maxRating).keys()].map((i) => ( // creates array of numbers 0-4, maps over each number, generates star icons for each number
          <FontAwesome
            key={i}
            name={i < rating ? 'star' : 'star-o'}
            color={i < rating ? '#FFDD45' : 'gray'}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* display username at top of screen */}
      <Text style={styles.viewTitle}>Username: {user}</Text>

      {/* display ratings info */}
      <Text style={styles.boldtext}>Title: </Text><Text style={styles.text}>{ratingData.song}</Text>
      <Text style={styles.boldtext}>Artist: </Text><Text style={styles.text}>{ratingData.artist}</Text>
      <Text style={styles.boldtext}>Username: </Text><Text style={styles.text}>{ratingData.username}</Text>
      <Text style={styles.boldtext}>Rating: </Text> 
      {renderStars(ratingData.rating)}

      {/* Back button that navigates users back to main screen */}
      <TouchableOpacity onPress={handleBack} style={styles.backtext}>
          <Text style={styles.backtext}>Back</Text>
        </TouchableOpacity>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0C27A4'
  },
  viewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingBottom: 40
  },
  backtext: {
    color: '#FFFFFF',
    fontSize: 17,
    paddingTop: 70,
    textAlign: 'center'
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingTop: 7,
    textAlign: 'center'
  },
  boldtext: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingTop: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 28,
    paddingTop: 7
  },
});

export default ViewRating;
