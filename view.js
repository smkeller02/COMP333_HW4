import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Displays a single ratings information
function ViewRating({ ratingData }) {
  const navigation = useNavigation();

  const handleBack = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Title: {ratingData.title}</Text>
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
