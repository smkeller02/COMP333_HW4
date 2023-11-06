import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

function UpdateRating({ route }) {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [rating, setRating] = useState(0); // Initialize rating as a number
  const [message, setMessage] = useState('');
  const { ratingId, user, onDataChanged } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    if (ratingId) {
      // Fetch the existing rating data for the given ratingId
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
            setRating(data[0].rating); // Ensure rating is a number
          }
        })
        .catch((error) => {
          console.error('Error fetching ratings:', error);
        });
    }
  }, [ratingId]);

  const handleCancel = () => {
    setArtist('');
    setSong('');
    setRating(0); // Reset rating to 0
    setMessage('');
    navigation.navigate('Ratings');
  };

  const handleSubmit = async () => {
    try {
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
        setMessage('Rating updated');
        onDataChanged();
        navigation.navigate('Ratings');
      } else if (response.status === 400) {
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

    return (
      <View style={styles.starRatingContainerHorizontal}>{starArray}</View>
      );
  };

  return (
    <View style={styles.updateRating}>
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
      <Text style={styles.text}>{renderStars()}</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.buttonContainer}>
          <Text style={styles.text}>Update rating</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={styles.buttonContainer}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.messageContainer}>
          {message ? <Text style={styles.messageText}>{message}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  updateRating: {
    borderBottomWidth: 1,
    borderBottomColor: '#0C27A4',
    marginVertical: 10,
    padding: 20,
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
  }
});

export default UpdateRating;
