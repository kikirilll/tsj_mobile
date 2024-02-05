// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginAndUserDataScreen from './LoginAndUserDataScreen';
import CounterSubmissionFormScreen from './CounterSubmissionFormScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginAndUserDataScreen">
        <Stack.Screen
          name="LoginAndUserDataScreen"
          component={LoginAndUserDataScreen}
          options={{ title: 'ТСЖ' }}
        />
        <Stack.Screen
          name="CounterSubmissionFormScreen"
          component={CounterSubmissionFormScreen}
          options={{ title: 'Подать счетчики' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;