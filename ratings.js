import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use FontAwesome or any other icon library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native-stack';

function Ratings({ route }) {
    const [data, setData] = useState([]); // Initialize data as an empty array
    const [loading, setLoading] = useState(true); // Initialize loading state as true
    const [user, setUser] = useState(null); // Initialize user state
    const navigation = useNavigation(); // Get the navigation object
    const { ratingDataChanged } = route.params;

    // Fetch ratings data from the API
    const fetchData = () => {
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

        // CHANGE IP ADDRESS TO YOUR SPECIFIC
        fetch('http://129.133.188.213/COMP333_HW4_backend/index.php/ratings')
        .then((response) => response.json())
        .then((ratingsData) => {
            setData(ratingsData); // Set the data with the fetched ratings
            setLoading(false); // Update loading state to false once data is loaded
        })
        .catch((error) => {
            console.error('Error fetching ratings:', error);
            setLoading(false); // Set loading to false in case of error
        });
    };

    useEffect(() => {
        fetchData(); // Initial data fetch
    
        // Add ratingDataChanged as a dependency to re-fetch data when it changes
    }, [user]);
  
    // Use the useFocusEffect hook to automatically refresh data when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const handleRatingPress = (item) => {
        // Handle the press on a rating item
        // When rating clicked, should be sent to view screen
        console.log('Rating pressed:', item);
    };

    const renderStars = (rating) => {
    const maxRating = 5;
  
    // Create an array to store star elements
    const starArray = [];
  
    // Fill the stars based on the rating value
    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        // Filled star
        starArray.push(
          <FontAwesome key={i} name="star" size={20} color="#FFDD45" />
        );
      } else {
        // Empty star
        starArray.push(
          <FontAwesome key={i} name="star" size={20} color="gray" />
        );
      }
    }
  
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {starArray}
      </View>
    );
  };

  return (
    <View>
        <Text style={styles.userText}>Welcome, {user}</Text>
        <Button
            title="Add New Rating"
            onPress={() =>
                navigation.navigate('Add New Rating', { user, onRatingAdded: refreshRatingsData })
            }
            color="#0C27A4"
        />
        {loading ? (
            <Text>Loading ratings...</Text>
        ) : (
            <FlatList
                data={data}
                keyExtractor={(rating) => rating.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.ratingItem}>
                        <TouchableOpacity
                            onPress={() => handleRatingPress(item)}
                            style={styles.ratingItem}
                        >
                            <Text style={styles.songText}>{item.song}</Text>
                            <Text style={styles.ratingText}>by {item.artist}</Text>
                            {renderStars(item.rating)}
                            <Text style={styles.ratingText}>Rated by: {item.username}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        )}
    </View>
);
}

const styles = StyleSheet.create({
    ratingItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#0C27A4',
      marginVertical: 10,
      padding: 20,
      alignItems: 'center', // Center the content both horizontally and vertically
      backgroundColor: '#0C27A4',
    },

    // Add a style for text
    ratingText: {
    color: '#FFFFFF', 
    textAlign: 'center',
  },

    songText: {
        color: '#FFFFFF',
        fontWeight: '900', // Make the text bold
        textAlign: 'center',
    },
    userText: {
        color: '#0C27A4',
        fontWeight: '900', // Make the text bold
        textAlign: 'center',
        fontSize: 24,
        paddingTop: 15,
        paddingBottom: 10
    }
  });
  

export default Ratings;