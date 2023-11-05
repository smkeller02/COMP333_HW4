import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function UpdateRating({ route }) {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [rating, setRating] = useState('');
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
            setRating(String(data[0].rating));
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
    setRating('');
    setMessage('');
    navigation.navigate('Ratings'); // Navigate to the 'Ratings' screen
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
          rating: parseFloat(rating), // Convert rating to a number
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let resJson = await response.json();
      if (response.status === 200) {
        setMessage('Rating updated');
        onDataChanged();
        navigation.navigate('Ratings')
      } else if (response.status === 400) {
        setMessage(resJson.error);
      } else {
        setMessage('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
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
          <TextInput
            style={styles.input}
            value={rating}
            onChangeText={(text) => setRating(text)}
            placeholder="Rating"
          />
          <View>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.text}>Update rating</Text>
            </TouchableOpacity>

            <View>
                {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>

            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
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
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingBottom: 20,
  },
});

export default UpdateRating;
