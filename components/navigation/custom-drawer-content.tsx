import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import profileImage from '../../static/dulluur.png';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

const CustomDrawer: React.FC<DrawerContentComponentProps> = ({navigation}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 62,
      }}>
      <View style={styles.drawerContainer}>
        {/* Профиль */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('profile');
          }}
          style={styles.profileBlock}>
          <Image
            source={profileImage} // заменишь на своего пользователя
            style={styles.avatar}
          />
          <View style={{flex: 1}}>
            <Text style={styles.name}>Оконешников Д.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Кнопка 1 */}
        <TouchableOpacity style={styles.menuItem}>
          <Image source={profileImage} style={styles.icon} />
          <Text style={styles.menuText}>Мои метки</Text>
        </TouchableOpacity>

        {/* Кнопка 2 */}
        <TouchableOpacity style={styles.menuItem}>
          <Image source={profileImage} style={styles.icon} />
          <Text style={styles.menuText}>Мои пути</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 32,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    width: screenWidth * 0.75,
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F1F4F6',
    borderRadius: 20,
    padding: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  name: {
    fontSize: 18,
    color: '#0F1C2E',
  },
  arrow: {
    fontSize: 24,
    color: '#0F1C2E',
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F4F6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 16,
  },
  menuText: {
    fontSize: 17,
    color: '#0F1C2E',
  },
});

export default CustomDrawer;
