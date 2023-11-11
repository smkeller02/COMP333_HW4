import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView, ScrollView, View, Text, FlatList, TouchableOpacity, StyleSheet, Button, LogBox} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Logout from './logout';
import ViewRating from './view'
import DeleteRating from './delete';
import { TopRatedSongs, AverageSongRatings, SongsPerArtist } from './statistics_component';

// Main screen that shows ratings and allows user to navigate to update, delete, view, logout, and add new rating screens
function Ratings() {
  // Initializing states
  const [data, setData] = useState([]); // Initialize data as an empty array
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const [user, setUser] = useState(null); // Initialize user state
  const navigation = useNavigation(); // Get the navigation object
  const [ratingDataChanged, setRatingDataChanged] = useState(false); // Declare ratingDataChanged as a state variable

  // Told in TA session to use this to ignore warning as functionality was working
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  // Fetch data from database, request to backend
  const fetchData = () => {
      // CHANGE IP ADDRESS TO YOUR SPECIFIC
      fetch('http://129.133.188.213/COMP333_HW4_backend/index.php/ratings')
      .then((response) => response.json())
      .then((ratingsData) => {
          setData(ratingsData); // Set data with fetched ratings
          setLoading(false); // Update loading state to false once data is loaded
      })
      .catch((error) => {
          console.error(error);
          setLoading(false); // Set loading to false in case of error
      });
  };
    
  useEffect(() => {
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

      // Fetch data on initial load
      fetchData();
  }, []);

    // Handles refreshing for new data
  const refreshRatingsData = () => {
      setRatingDataChanged(!ratingDataChanged);
  };

  useEffect(() => {
      // Conditionally fetch data when ratingDataChanged is true to auto reload once ratings datatable is changed
      if (ratingDataChanged) {
        fetchData();
        // Reset the state to false after data is fetched
        setRatingDataChanged(false);
      }
    }, [ratingDataChanged]);    

    // Check if a song is created by the logged-in user
    const isSongCreatedByUser = (rating) => {
        // determine if the song is created by the logged-in user
        return user === rating.username;
    };
  
    // Handles logout request
    const handleLogout = () => {
      navigation.navigate('Logout');
    }

    //Handles navigation to update page, sending porper info to that screen
    const handleUpdate = (ratingId) => {
      navigation.navigate('Update Rating', {
        ratingId: ratingId,
        user: user,
        onDataChanged: refreshRatingsData,
      });
    };
    
  // Render star icons based on the rating
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
      // displays star rating
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {starArray}
        {isSongCreatedByUser ? (
          <>
            <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => navigation.navigate('DeleteRating', { ratingId: item.id, onDataChanged: refreshRatingsData })}>
              <FontAwesome name="trash" size={25} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    );
  };

return (
      <SafeAreaView style={styles.container}>

        {/* button for user to log */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logouttext}>Logout</Text>
        </TouchableOpacity>

        {/* welcome message */}
        <Text style={styles.userText}>Welcome, {user}</Text>
        
        {/* button for adding new rating that navigates user to add new rating screen */}
        <Button
          title="Add New Rating"
          onPress={() => {
            navigation.navigate('Add New Rating', {
              user: user,
              onRatingAdded: refreshRatingsData,
            });
          }}
          color="#0C27A4"
        />

        {/* Conditionally render loading message or a list of ratings */}
        {loading ? (
          <Text>Loading ratings...</Text>
        ) : (
          <ScrollView style={styles.scrollView}>
              {data.map((item) => (
              // Render each rating item in list
              <View style={styles.ratingItem} key={item.id}>
                  <TouchableOpacity
                  onPress={() => navigation.navigate('ViewRating', { ratingData: item })}
                  style={styles.ratingItem}
                  >
                  <Text style={styles.songText}>{item.song}</Text>
                  <Text style={styles.ratingText}>by {item.artist}</Text>
                  {renderStars(item.rating)}
                  <Text style={styles.ratingText}>Rated by: {item.username}</Text>
                  </TouchableOpacity>

                  {/* Check that rating was created by user, if so, show update and delete icons, if not, null */}
                  {isSongCreatedByUser(item) ? (
                  // Show update icon
                  <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => handleUpdate(item.id, item.rating)}
                  >
                      <FontAwesome name="pencil" size={25} color="#FFFFFF" />
                  </TouchableOpacity>
                  ) : null}
              </View>
              ))}
              <TopRatedSongs ratings={data} />
              <AverageSongRatings ratings={data} />
              <SongsPerArtist ratings={data} />
          </ScrollView>
      )}
  </SafeAreaView>

);
}

// Styling
const styles = StyleSheet.create({
  ratingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#0C27A4',
    marginVertical: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#0C27A4',
  },

  ratingText: {
  color: '#FFFFFF', 
  textAlign: 'center',
},

  songText: {
      color: '#FFFFFF',
      fontWeight: '900',
      textAlign: 'center',
  },
  userText: {
      color: '#0C27A4',
      fontWeight: '900',
      textAlign: 'center',
      fontSize: 24,
      paddingTop: 15,
      paddingBottom: 10
  },
  scrollView: {
      backgroundColor: '#FFFFFF',
      marginHorizontal: 20,
  },
  container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    logouttext: {
      color: '#0C27A4',
      fontSize: 18,
      fontWeight: '500',
      paddingTop: 10,
      paddingRight: 20,
      textAlign: 'right'
    }
});


export default Ratings;