import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

// Updates a given rating with new inputs from user
function UpdateRating({ route }) {
  // Set states
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  // Extract parameters from route
  const { ratingId, user, onDataChanged } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    if (ratingId) {
      // Fetch the existing rating data for the given ratingId
      // CHANGE IP ADDRESS TO YOUR SPECIFIC
      fetch(`http://129.133.188.213/COMP333_HW4_backend/index.php/viewrating?id=${ratingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setMessage(data.error);
          } else {
            setArtist(data[0].artist);
            setSong(data[0].song);
            setRating(data[0].rating);
          }
        })
        .catch((error) => {
          console.error('Error fetching ratings:', error);
        });
    }
  }, [ratingId]);

  // handles cancel request, sends user back to main ratings screen
  const handleCancel = () => {
    setArtist('');
    setSong('');
    setRating(0);
    setMessage('');
    navigation.navigate('Ratings');
  };

  // handles submit request for updating a rating
  const handleSubmit = async () => {
    try {
      // Send POST request to backend with user input
      // CHANGE IP ADDRESS TO YOUR SPECIFIC
      let response = await fetch('http://129.133.188.213/COMP333_HW4_backend/index.php/updaterating', {
        method: 'POST',
        body: JSON.stringify({
          id: ratingId,
          username: user,
          artist,
          song,
          rating,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let resJson = await response.json();
      if (response.status === 200) {
        // If good HTTP request:
        setMessage('Rating updated');
        // Trigger callback to update data
        onDataChanged();
        // Navigate back to main page
        navigation.navigate('Ratings');
      } else if (response.status === 400) {
        // Bad HTTP request:
        setMessage(resJson.error);
      } else {
        setMessage('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle star rating selection
  const handleStarPress = (starIndex) => {
    // Set the rating based on the selected star
    setRating(starIndex + 1);
  };

  // Function to render star icons
  const renderStars = () => {
    const maxRating = 5;
    const starArray = [];

    // make star icon for each rating value
    for (let i = 0; i < maxRating; i++) {
      starArray.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starContainer}
        >
          <FontAwesome
            name={i < rating ? 'star' : 'star-o'}
            size={40}
            color={i < rating ? 'gold' : 'gray'}
          />
        </TouchableOpacity>
      );
    }

    // Return view with star icons
    return (
      <View style={styles.starRatingContainerHorizontal}>{starArray}</View>
      );
  };

  return (
    <View style={styles.updateRating}>
      {/* display username at top of screen */}
      <Text style={styles.userText}>Username: {user}</Text>

      {/* display artist, song, and rating with preloaded values */}
      <View>
        <TextInput
          style={styles.input}
          value={artist}
          onChangeText={(text) => setArtist(text)}
          placeholder="Artist"
        />
        <TextInput
          style={styles.input}
          value={song}
          onChangeText={(text) => setSong(text)}
          placeholder="Song"
        />
        {/* Render stars */}
        <Text style={styles.text}>{renderStars()}</Text>

        {/* update button that triggers submit process */}
        <TouchableOpacity onPress={handleSubmit} style={styles.buttonContainer}>
          <Text style={styles.text}>Update rating</Text>
        </TouchableOpacity>

        {/* Cancel button that navigates users back to main screen */}
        <TouchableOpacity onPress={handleCancel} style={styles.buttonContainer}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>

        {/* Display any error messages if they occur */}
        <View style={styles.messageContainer}>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </View>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  updateRating: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    backgroundColor: '#0C27A4',
    fontSize: 20,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
  },
  message: {
    color: '#FF6B6B',
    fontSize: 18,
    backgroundColor: '#0C27A4',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingBottom: 20,
  },
  starRatingContainerHorizontal: {
    flexDirection: 'row', // Set the direction to row for horizontal arrangement
  },  
  userText: {
    color: '#FFFFFF',
    fontWeight: '900', // Make the text bold
    textAlign: 'center',
    fontSize: 24,
    paddingTop: 15,
    paddingBottom: 10
 }
});

export default UpdateRating;
