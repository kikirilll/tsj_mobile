// LoginAndUserDataScreen.js

import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text, Picker } from 'react-native';
import axios from 'axios';

const LoginAndUserDataScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [userData, setUserData] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedCounterData, setSelectedCounterData] = useState(null);
    const [userProfiles, setUserProfiles] = useState([]); // State to store user profiles
    
    useEffect(() => {
      if (userData && userData.profile) {
        setUserProfiles(userData.profile); // Set user profiles in state
      }
    }, [userData]);
  
    const handleLogin = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
          username,
          password,
        });
  
        if (response.status === 200) {
          const receivedToken = response.data.token;
          setToken(receivedToken);
  
          // Fetch user data after successful login
          const userDataResponse = await axios.get('http://127.0.0.1:8000/api/profiles/counters/', {
            headers: {
              authorization: `token ${receivedToken}`,
            },
          });

  
          if (userDataResponse.status === 200) {
            setUserData(userDataResponse.data);
            if (
              userDataResponse.data &&
              userDataResponse.data.profile &&
              userDataResponse.data.profile.length > 0
            ) {
              // Set initial selected profile to the first one in the list
              setSelectedProfile(userDataResponse.data.profile[0]);
            }
          } else {
            console.error('Failed to fetch user data');
          }
        } else {
          console.error('Login failed');
          Alert.alert('Login Failed', 'Invalid username or password');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred');
      }
    };

    const handleNavigateToSubmissionForm = () => {
        console.log('here is the profile id:', selectedProfile.id);
        console.log('here is the authToken:', token);
        navigation.navigate('CounterSubmissionFormScreen', { selectedProfileId: selectedProfile.id, authToken: token, callback: handleLogin });
      };
  
    useEffect(() => {
      console.log('Selected Profile:', selectedProfile); // Log the selected profile for debugging
      console.log('Counters:', JSON.stringify(userData)); // Log the selected profile for debugging
      if (userData && userData.counters && selectedProfile) {
        const filteredCounters = userData.counters.filter(
          (counter) => counter.profile === selectedProfile.id
        );
        console.log('Filtered Counters:', filteredCounters); // Log the filtered counters for debugging
        setSelectedCounterData(filteredCounters);
      }
      else {
        setSelectedCounterData([]); // Set an empty array if no counters found for the selected profile
      }
    }, [selectedProfile, userData]);
  
    const renderCounters = () => {
      // Render user counters based on selected profile
      // Code for rendering counters (similar to the previous example)
      if (!selectedCounterData || selectedCounterData.length === 0) {
          return (
            <View style={styles.noDataContainer}>
              <Text>Ранее никаких показаний не было</Text>
            </View>
          );
        }
    
        return (
          <FlatList
            data={selectedCounterData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.counterItem}>
                <Text>ID: {item.id}</Text>
                <Text>Холодная вода: {item.coldWater}</Text>
                <Text>Горячая вода: {item.hotWater}</Text>
                <Text>Электричество: {item.electricity}</Text>
                <Text>Дата: {item.date}</Text>
              </View>
            )}
          />
        );
    };
  
    const renderProfilePicker = () => {
      // Render profile picker (similar to the previous example)
      if (!userProfiles || userProfiles.length === 0) {
        return null;
      }
      const getBuildingDetails = (buildingId) => {
        const foundBuilding = userData.building.find((building) => building.id === buildingId);
        return foundBuilding
          ? `${foundBuilding.cityName} ${foundBuilding.streetName} ${foundBuilding.houseNumber}`
          : 'Building Details Not Found';
      };
      return (
        <View style={styles.pickerContainer}>
          <Text>Выберите квартиру из списка:</Text>
          <Picker
            selectedValue={selectedProfile ? userProfiles.indexOf(selectedProfile) : null}
            style={styles.picker}
            onValueChange={(itemIndex) => {
              console.log('ID of a new profile to be switched:', itemIndex);
              console.log('All userData profiles:', userData.profile);
              const profile = userProfiles[itemIndex]; // Retrieve the profile by index
              setSelectedProfile(profile); // Set the whole profile object
              console.log('Switched Profile:', profile);
            }}
          >
            {userProfiles.map((profile, index) => (
              // console.log(userData.building),
              <Picker.Item
                key={profile.id}
                label={`${getBuildingDetails(profile.building_id)} ${profile.flatNumber}`}
                value={index} // Set the value to the index of the profile in the array
              />
            ))}
          </Picker>
        </View>
      );
    };
  
    if (token) {
      return (
        <View style={styles.container}>
          {renderProfilePicker()}
          <View style={styles.counterContainer}>
            <Button title="Подать показания счетчиков" onPress={handleNavigateToSubmissionForm} />
            <Text style={styles.counterHeader}>Прошлые показания счетчиков</Text>
            {renderCounters()}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <Button title="Авторизоваться" onPress={handleLogin} />
        </View>
      );
    }
  };
  
  const styles = StyleSheet.create({
    // Styles definition (similar to the previous examples)
    input: {
      width: '80%',
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pickerContainer: {
      marginBottom: 20,
      width: '100%',
    },
    picker: {
      height: 50,
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
    },
    counterContainer: {
      flex: 1,
      width: '100%',
    },
    counterHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    counterItem: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
    },
    noDataContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  
  export default LoginAndUserDataScreen;