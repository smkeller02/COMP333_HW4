import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet, Button, LogBox, Modal, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Logout from './logout';
import ViewRating from './view'
import DeleteRating from './delete';
import { TopRatedSongs, AverageSongRatings, SongsPerArtist } from './statistics_component';
import { Picker } from '@react-native-picker/picker';

// Main component that displays ratings table, as well as buttons for logout, add new rating, update, delete, view
function Ratings() {
  // Initialize states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [ratingDataChanged, setRatingDataChanged] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParam, setFilterParam] = useState('All');
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const navigation = useNavigation();

  //Told in TA session to use this to ignore warning as functionality was working
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  // Handles fetching ratings data from backend
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
    // Also, update the filtered data based on the search and filter criteria
    filterItems();
    }, [ratingDataChanged, searchQuery, filterParam, data]);    

    // Check if a song is created by the logged-in user
    const isSongCreatedByUser = (rating) => {
      // Determine if the song is created by the logged-in user
      return user === rating.username;
    };

    // Function to filter the items based on search and filter criteria
    const filterItems = () => {
      // Convert searchQuery to lowercase, remove leading/trailing whitespace
      const searchTerms = searchQuery.toLowerCase().trim();
      // If filter is selected, apply a general filter
      if (filterParam === 'All') {
        setFilteredData(
          data.filter(
            (rating) =>
              searchTerms === '' ||
              rating.username?.toLowerCase().includes(searchTerms) ||
              rating.artist?.toLowerCase().includes(searchTerms) ||
              rating.song?.toLowerCase().includes(searchTerms) ||
              rating.rating?.toString().includes(searchTerms)
          )
        );
      } else {
        const filterProperty = filterParam?.toLowerCase();
        // If a specific filter is selected, apply filter based on the chosen property
        setFilteredData(
          data.filter((rating) => {
            if (filterProperty === 'rating') {
              // If the filter is based on rating, convert rating to string for comparison
              return rating[filterProperty]?.toString().includes(searchTerms.toLowerCase());
            } else {
              // Otherwise, apply a filter based on chosen filter
              return rating[filterProperty]?.toLowerCase().includes(searchTerms.toLowerCase());
            }
          })
        );
      }
    }
    
    // Handles logout request
    const handleLogout = () => {
      navigation.navigate('Logout');
    }

    // Handles navigation to update page
    const handleUpdate = (ratingId) => {
      navigation.navigate('Update Rating', {
        ratingId: ratingId,
        user: user,
        onDataChanged: refreshRatingsData,
      });
    };
    
  // Handles navigation to delete page
  const handleDelete = (ratingId) => {
    navigation.navigate('Delete Rating', { 
      ratingId: ratingId, 
      onDataChanged: refreshRatingsData
    });
  }

  // Function for creating star icons for rating
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

  // Return star array view
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {starArray}
    </View>
  );
};

return (
      <SafeAreaView style={styles.container}>
        {/* Logout button */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logouttext}>Logout</Text>
        </TouchableOpacity>
        {/* welcome message */}
        <Text style={styles.userText}>Welcome, {user}</Text>
        {/* Add new rating button */}
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

      {/* display filter+search */}
      <View style={styles.filterSearchContainer}>
        {/* Text input for searching */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search for..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            {/* Filter selection label */}
            <Text style={styles.filterLabel}>Filter By: {filterParam}</Text>
          </TouchableOpacity>
        </View>
        {/* Modal for selecting a filter */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isFilterModalVisible}
          onRequestClose={() => {
            setFilterModalVisible(false);
          }}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Filter</Text>
            {/* Option to clear the filter */}
            <TouchableOpacity
              onPress={() => {
                setFilterParam('All');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.modalOption}>No Filter</Text>
            </TouchableOpacity>

            {/* Option to filter by username */}
            <TouchableOpacity
              onPress={() => {
                setFilterParam('Username');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.modalOption}>User</Text>
            </TouchableOpacity>

            {/* Option to filter by artist */}
            <TouchableOpacity
              onPress={() => {
                setFilterParam('Artist');
                setFilterModalVisible(false);
              }}
             >
              <Text style={styles.modalOption}>Artist</Text>
            </TouchableOpacity>
          
            {/* Option to filter by song */}
            <TouchableOpacity
              onPress={() => {
                setFilterParam('Song');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.modalOption}>Song</Text>
            </TouchableOpacity>

            {/* Option to filter by rating */}
            <TouchableOpacity
              onPress={() => {
                setFilterParam('Rating');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.modalOption}>Rating</Text>
            </TouchableOpacity>

            {/* Option to cancel filter selection */}
            <TouchableOpacity
              onPress={() => {
                setFilterModalVisible(false);
              }} 
            >
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* If still loading, show proper message, else show ratings datatable */}
      {loading ? (
        <Text>Loading ratings...</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* Check that there is data after filter, if not, show message, if so, display */}
          {filteredData.length === 0 ? (
              <Text style={styles.noresults}>No results found</Text>
          ) : (
            // display ratings
            filteredData.map((item) => (
            <View style={styles.ratingItem} key={item.id}>
                <TouchableOpacity
                onPress={() => navigation.navigate('View Rating', { ratingData: item })}
                style={styles.ratingItem}
                >
                <Text style={styles.songText}>{item.song}</Text>
                <Text style={styles.ratingText}>by {item.artist}</Text>
                {/* Star rating */}
                {renderStars(item.rating)}
                <Text style={styles.ratingText}>Rated by: {item.username}</Text>

                </TouchableOpacity>
                {/* Check if user rated rating, if so, display update and delete icons */}
                {isSongCreatedByUser(item) ? (
                <View style={styles.iconContainer}>
                    {/* display pencil for update */}
                    <TouchableOpacity style={styles.updateButton} 
                      onPress={() => handleUpdate(item.id, item.rating)}>
                      <FontAwesome name="pencil" size={25} color="#FFFFFF" />
                    </TouchableOpacity>
                    {/* display trash for delete */}
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}>
                      <FontAwesome name="trash" size={25} color="#FFFFFF" />
                </TouchableOpacity>
                </View>
              ) : null}
            </View>
            ))
          )
          }

          {/* Statistical analysis portion */}
          <TopRatedSongs ratings={filteredData} />
          <AverageSongRatings ratings={filteredData} />
          <SongsPerArtist ratings={filteredData} />

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
    paddingBottom: 10,
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
    textAlign: 'right',
  },
  filterSearchContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#0C27A4',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#0C27A4',
  },
  filterLabel: {
    color: '#0C27A4',
    fontSize: 18,
    fontWeight: '400',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 150, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    minWidth: 200,
  },
  modalTitle: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 10,
    color: '#0C27A4'
  },
  modalOption: {
    paddingVertical: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    color: '#0C27A4',
  },
  modalCancel: {
    paddingVertical: 10,
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  updateButton: {
    paddingBottom: 20
  },
  noresults: {
    backgroundColor: '#0C27A4',
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 6,
    paddingBottom: 6
  }
  });
  

export default Ratings;