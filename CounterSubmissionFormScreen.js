// CounterSubmissionFormScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const CounterSubmissionFormScreen = ({ route, navigation }) => {
  const [coldWater, setColdWater] = useState('');
  const [hotWater, setHotWater] = useState('');
  const [electricity, setElectricity] = useState('');

  const {selectedProfileId, authToken, callback} = route.params;
  console.log('here is the profile id from form page:', selectedProfileId);
  console.log('here is the authToken from form page:', authToken);

  const handleSubmit = () => {
    // Construct the request body
    const requestBody = {
      profile: selectedProfileId,
      coldWater,
      hotWater,
      electricity,
    };
    console.log('request:', requestBody);

    // Send the request to the server using fetch or Axios
    // Replace the URL and HTTP method with your actual API endpoint and method
    fetch('http://127.0.0.1:8000/api/profiles/counters/add/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `token ${authToken}`,
        // Add any additional headers if required
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful submission
        console.log('Counter data submitted successfully:', data);

        // Navigate back to the user data screen after successful submission
        // navigation.navigate('LoginAndUserDataScreen', { updatedData: data });
        callback();
        // navigation.goBack();
      })
      .catch((error) => {
        // Handle error cases
        console.error('Error submitting counter data:', error);
      });
      navigation.goBack();
      // navigation.navigate('LoginAndUserDataScreen');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Холодная вода"
        onChangeText={(text) => setColdWater(text)}
        value={coldWater}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Горячая вода"
        onChangeText={(text) => setHotWater(text)}
        value={hotWater}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Электричество"
        onChangeText={(text) => setElectricity(text)}
        value={electricity}
        keyboardType="numeric"
      />
      <Button title="Отправить" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '80%',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
});

export default CounterSubmissionFormScreen;
