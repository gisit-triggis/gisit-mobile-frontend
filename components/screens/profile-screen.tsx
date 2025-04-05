import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {IProfileResponse, IUser} from '../../interfaces/user';
import {AuthService} from '../../services/auth/auth.service';
import {Text} from 'react-native-gesture-handler';
import Button from '../ui/button';
import backArrow from '../../static/arrow-left.png';
import penImage from '../../static/pen.png';
import userImage from '../../static/user.png';
import mailImage from '../../static/mail.png';
import {COLORS} from '../../constants/colors';
import ProfileTextField from '../ui/profile-textfield';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedSurname, setEditedSurname] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Сначала пытаемся загрузить профиль из AsyncStorage
        const storedProfileStr = await AsyncStorage.getItem('userProfile');
        if (storedProfileStr) {
          const storedProfile: IUser = JSON.parse(storedProfileStr);
          setProfile(storedProfile);
          setEditedName(storedProfile.name);
          setEditedSurname(storedProfile.surname);
        }
        // Затем делаем запрос к серверу
        const response = await AuthService.getProfile();
        const serverProfile: IUser = response.data;
        // Если сервер не вернул avatar_url, но в сохранённых данных оно есть, используем его
        const mergedProfile: IUser = {
          ...serverProfile,
          avatar_url:
            serverProfile.avatar_url ||
            (storedProfileStr
              ? JSON.parse(storedProfileStr).avatar_url
              : undefined),
        };
        setProfile(mergedProfile);
        setEditedName(mergedProfile.name);
        setEditedSurname(mergedProfile.surname);
        // Сохраняем объединённый профиль в AsyncStorage
        await AsyncStorage.setItem(
          'userProfile',
          JSON.stringify(mergedProfile),
        );
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        setErrorMessage('Не удалось загрузить профиль');
        navigation.navigate('login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigation.navigate('login');
    } catch (err) {
      console.error('Ошибка выхода:', err);
      Alert.alert('Ошибка', 'Не удалось выполнить выход');
    }
  };

  const handleSave = async () => {
    setErrorMessage('');
    try {
      const updatedProfile = await AuthService.changeProfile({
        name: editedName,
        surname: editedSurname,
      });
      const newProfile: IUser = profile
        ? {
            ...profile,
            ...updatedProfile.data,
            full_name: `${updatedProfile.data.name} ${updatedProfile.data.surname}`,
          }
        : null;

      setProfile(newProfile);

      if (newProfile) {
        await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
      }

      Alert.alert('Успешно', 'Профиль обновлён');
    } catch (error: any) {
      console.error('Ошибка обновления профиля:', error);
      setErrorMessage(
        error?.response?.data?.message || 'Ошибка обновления профиля',
      );
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      });

      if (result.didCancel) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri) {
          setLoading(true);
          // Отправляем изображение на сервер
          const response = await AuthService.uploadProfilePhoto(asset.uri);
          // Пытаемся получить новый URL из ответа API:
          const newAvatarUrl = response.data.url || '';
          // Обновляем состояние профиля с новым URL изображения
          setProfile(prev => {
            const updatedProfile = prev
              ? {
                  ...prev,
                  avatar_url: newAvatarUrl,
                }
              : null;
            if (updatedProfile) {
              console.log('KSDLJF');
              AsyncStorage.setItem(
                'userProfile',
                JSON.stringify(updatedProfile),
              );
            }
            return updatedProfile;
          });
          Alert.alert('Успешно', 'Изображение профиля обновлено');
        }
      }
    } catch (error: any) {
      console.error('Ошибка при выборе изображения:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 24,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={{height: 24, width: 24}} source={backArrow} />
          </TouchableOpacity>
          <Text style={{fontSize: 18}}>Редактирование профиля</Text>
          <View style={{width: 24, height: 24}} />
        </View>

        {/* Profile */}
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: 167,
            position: 'relative',
          }}>
          <Image
            source={{
              uri:
                profile?.avatar_url ||
                'https://upload.wikimedia.org/wikipedia/commons/e/e0/Userimage.png',
            }}
            style={{width: 145, height: 145, borderRadius: 10000}}
          />

          <TouchableOpacity
            style={{position: 'absolute', bottom: 0, marginHorizontal: 'auto'}}
            onPress={handlePickImage}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 44,
                height: 44,
                backgroundColor: COLORS.white,
                borderRadius: 10000,
              }}>
              <Image style={{width: 24, height: 24}} source={penImage} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
          <ProfileTextField
            icon={userImage}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Введите имя"
          />
          <ProfileTextField
            icon={userImage}
            value={editedSurname}
            onChangeText={setEditedSurname}
            placeholder="Введите фамилию"
          />
          <ProfileTextField value={profile?.email || ''} icon={mailImage} />

          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              gap: 8,
              position: 'absolute',
              bottom: 0,
            }}>
            <Button onPress={handleSave}>Сохранить</Button>
            <Button variant="danger" onPress={handleLogout}>
              Выйти
            </Button>
          </View>

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProfileScreen;
