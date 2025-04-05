import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  DrawerContentComponentProps,
  useDrawerStatus,
} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

interface IUserProfile {
  full_name: string;
  avatar_url: string;
}

const CustomDrawer: React.FC<DrawerContentComponentProps> = ({navigation}) => {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const drawerStatus = useDrawerStatus();

  const fetchUserProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userProfile');
      if (storedUser) {
        setUserProfile(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Ошибка загрузки данных профиля:', error);
    }
  };

  useEffect(() => {
    if (drawerStatus === 'open') {
      fetchUserProfile();
    }
  }, [drawerStatus]);

  return (
    <SafeAreaView style={{flex: 1, paddingTop: 62}}>
      <View style={styles.drawerContainer}>
        {/* Блок профиля */}
        <TouchableOpacity
          onPress={() => navigation.navigate('profile')}
          style={styles.profileBlock}>
          <Image
            source={
              userProfile && userProfile.avatar_url
                ? {uri: userProfile.avatar_url}
                : require('../../static/dulluur.png')
            }
            style={styles.avatar}
          />
          <View style={{flex: 1}}>
            <Text style={styles.name}>
              {userProfile && userProfile.full_name
                ? userProfile.full_name
                : 'Имя пользователя'}
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Пример кнопок меню */}
        <TouchableOpacity
          onPress={() => navigation.navigate('my_marks')}
          style={styles.menuItem}>
          <Image
            source={require('../../static/dulluur.png')}
            style={styles.icon}
          />
          <Text style={styles.menuText}>Мои метки</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('my_routes')}
          style={styles.menuItem}>
          <Image
            source={require('../../static/dulluur.png')}
            style={styles.icon}
          />
          <Text style={styles.menuText}>Мои пути</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
