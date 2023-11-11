import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Gathers the top rated songs from datatable
function TopRatedSongs({ ratings }) {
  // Sort the ratings in descending order based on the star rating value (select the top five)
  const topRatedSongs = [...ratings].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <View style={styles.statisticsContainer}>
      <Text style={styles.statisticsTitle}>Top Rated Songs</Text>
      {topRatedSongs.map((song) => (
        <Text key={song.id}>{song.song} by {song.artist} - Rating: {song.rating}</Text>
      ))}
    </View>
  );
}

// Gathers the average rating of songs from datatable
function AverageSongRatings({ ratings }) {
  // calculate total rating and the number of ratings
  const totalRatings = ratings.length;
  const totalRatingValue = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  // in edge case, where there is no rating
  const averageRating = totalRatings > 0 ? (totalRatingValue / totalRatings).toFixed(2) : 0;

  return (
    <View style={styles.statisticsContainer}>
      <Text style={styles.statisticsTitle}>Average Song Ratings</Text>
      <Text>Average Rating: {averageRating}</Text>
    </View>
  );
}

// Gathers the number of songs per artist from the ratings datatable
function SongsPerArtist({ ratings }) {
  const artistCounts = {};
  // Iterate through the ratings to count the songs per artist.
  ratings.forEach((rating) => {
    artistCounts[rating.artist] = (artistCounts[rating.artist] || 0) + 1;
  });

  return (
    <View style={styles.statisticsContainer}>
      <Text style={styles.statisticsTitle}>Number of Songs per Artist</Text>
      {Object.entries(artistCounts).map(([artist, count]) => (
        <Text key={artist}>
          {artist}: {count} {count === 1 ? 'song' : 'songs'} {/* song if 1, songs if more than 1*/}
        </Text>
      ))}
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  statisticsContainer: {
    marginVertical: 10,
  },
  statisticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export { TopRatedSongs, AverageSongRatings, SongsPerArtist };