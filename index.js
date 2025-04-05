/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import MainNavigator from './components/navigation/main-navigator';

AppRegistry.registerComponent(appName, () => MainNavigator);
