import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MapScreen from '../screens/map-screen';
import CustomDrawer from './custom-drawer-content';
import ProfileScreen from '../screens/profile-screen';
import MyMarksScreen from '../screens/my-marks-screen';
import MyRoutesScreen from '../screens/my-routes-screen';
import LLMFAQScreen from '../screens/llm-faq-screen';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'transparent',
        drawerStyle: {
          width: '75%',
          backgroundColor: 'transparent',
        },
      }}>
      <Drawer.Screen name="main" component={MapScreen} />
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="profile"
        component={ProfileScreen}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="my_marks"
        component={MyMarksScreen}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="my_routes"
        component={MyRoutesScreen}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="llm"
        component={LLMFAQScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
