import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/login-screen';
import RegisterScreen from '../screens/register-screen';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './drawer-navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="main"
            options={{title: 'Main'}}
            component={DrawerNavigation}
          />
          <Stack.Screen
            name="login"
            options={{title: 'Login'}}
            component={LoginScreen}
          />
          <Stack.Screen
            name="register"
            options={{title: 'Register'}}
            component={RegisterScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
