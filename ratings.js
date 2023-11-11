import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button, LogBox} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use FontAwesome or any other icon library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Logout from './logout';
import ViewRating from './view'
import DeleteRating from './delete';
import { TopRatedSongs, AverageSongRatings, SongsPerArtist } from './statistics_component';
import {Picker} from '@react-native-picker/picker';

function Ratings() {
    const [data, setData] = useState([]); // Initialize data as an empty array
    const [loading, setLoading] = useState(true); // Initialize loading state as true
    const [user, setUser] = useState(null); // Initialize user state
    const navigation = useNavigation(); // Get the navigation object
    const [ratingDataChanged, setRatingDataChanged] = useState(false); // Declare ratingDataChanged as a state variable
    const [searchQuery, setSearchQuery] = useState('');
    const [filterParam, setFilterParam] = useState('All');
    const [filteredData, setFilteredData] = useState([]);

    //Told in TA session to use this to ignore warning as functionality was working
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);

    const fetchData = () => {
        // CHANGE IP ADDRESS TO YOUR SPECIFIC
        fetch('http://129.133.188.213/COMP333_HW4_backend/index.php/ratings')
        .then((response) => response.json())
        .then((ratingsData) => {
            setData(ratingsData); // Set the data with the fetched ratings
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
        // Conditionally fetch data when ratingDataChanged is true
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

        const filterItems = () => {
          const searchTerms = searchQuery.toLowerCase().trim();
          if (filterParam === 'All') {
            setFilteredData(
              data.filter((rating) =>
                searchTerms === '' ||
                rating.username?.toLowerCase().includes(searchTerms) ||
                rating.artist?.toLowerCase().includes(searchTerms) ||
                rating.song?.toLowerCase().includes(searchTerms) ||
                rating.rating?.toString().includes(searchTerms)
              )
            );
          } else {
            const filterProperty = filterParam?.toLowerCase();
            setFilteredData(data.filter((rating) => rating[filterProperty]?.toLowerCase().includes(searchTerms)));
          }
        };
      
      // Handles logout request
      const handleLogout = () => {
        navigation.navigate('Logout');
      }

      //Handles navigation to update page
      const handleUpdate = (ratingId) => {
        navigation.navigate('Update Rating', {
          ratingId: ratingId,
          user: user,
          onDataChanged: refreshRatingsData,
        });
      };
      
      const handleDelete = (ratingId) => {
        navigation.navigate('Delete Rating', { 
          ratingId: ratingId, 
          onDataChanged: refreshRatingsData
        });
      }

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
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logouttext}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.userText}>Welcome, {user}</Text>
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
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            <View style={styles.filterSelect}>
              <Text>Filter By: </Text>
              <Picker
                selectedValue={filterParam}
                onValueChange={(itemValue) => setFilterParam(itemValue)}>
                <Picker.Item label="No Filter" value="All" />
                <Picker.Item label="User" value="username" />
                <Picker.Item label="Artist" value="artist" />
                <Picker.Item label="Song" value="song" />
                <Picker.Item label="Rating" value="rating" />
              </Picker>
            </View>
          </View>
          {loading ? (
            <Text>Loading ratings...</Text>
          ) : (
            <ScrollView style={styles.scrollView}>
                {data.map((item) => (
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
                    {isSongCreatedByUser(item) ? (
                    <View style={styles.iconContainer}>
                      <TouchableOpacity style={styles.updateButton} 
                        onPress={() => handleUpdate(item.id, item.rating)}>
                        <FontAwesome name="pencil" size={25} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}>
                        <FontAwesome name="trash" size={25} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                    ) : null}
                </View>
                ))}
                <TopRatedSongs ratings={filteredData} />
                <AverageSongRatings ratings={filteredData} />
                <SongsPerArtist ratings={filteredData} />
            </ScrollView>
        )}
    </SafeAreaView>

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