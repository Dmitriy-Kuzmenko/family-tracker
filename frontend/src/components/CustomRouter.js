import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from 'react-redux';

// App screens
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

const Stack = createStackNavigator();

export default function CustomRouter() {
  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <NavigationContainer>
      {isAuth ?
        (
          <Stack.Navigator
            initialRouteName="MainScreen"
            screenOptions={{ headerMode: false }}
          >
            <Stack.Screen name="MainScreen" component={MainScreen} />
          </Stack.Navigator>
        ) :
        (
          <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{ headerMode: false }}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
          </Stack.Navigator>
        )
      }
    </NavigationContainer>
  );
}