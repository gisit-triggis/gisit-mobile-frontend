import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MapScreen from '../screens/map-screen';
import LoginScreen from '../screens/login-screen';
import ProfileScreen from '../screens/profile-screen';

// export type RootDrawerParamList = {
//   Город: undefined;
//   'История заказов': undefined;
//   Межгород: undefined;
//   Безопасность: undefined;
//   Настройки: undefined;
//   Помощь: undefined;
//   'Служба поддержки': undefined;
// };

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    // <NavigationContainer>
    <Drawer.Navigator>
      <Drawer.Screen name="main" component={MapScreen} />
      <Drawer.Screen name="profile" component={ProfileScreen} />
    </Drawer.Navigator>
    // </NavigationContainer>
  );
};

export default DrawerNavigation;
