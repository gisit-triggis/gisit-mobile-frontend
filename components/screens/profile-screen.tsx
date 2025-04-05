import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
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
import profileImage from '../../static/dulluur.png';
import penImage from '../../static/pen.png';
import userImage from '../../static/user.png';
import mailImage from '../../static/mail.png';
import {COLORS} from '../../constants/colors';
import ProfileTextField from '../ui/profile-textfield';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Локальные переменные для редактирования профиля
  const [editedName, setEditedName] = useState('');
  const [editedSurname, setEditedSurname] = useState('');

  useEffect(() => {
    // Загружаем профиль при монтировании
    AuthService.getProfile()
      .then((response: IProfileResponse) => {
        setProfile(response.data);
        setEditedName(response.data.name);
        setEditedSurname(response.data.surname);
      })
      .catch(error => {
        console.error('Ошибка загрузки профиля:', error);
        setErrorMessage('Не удалось загрузить профиль');
        navigation.navigate('login'); // если ошибка, перенаправляем на логин
      })
      .finally(() => setLoading(false));
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

  // Функция сохранения изменений
  const handleSave = async () => {
    setErrorMessage('');
    try {
      const updatedProfile = await AuthService.changeProfile({
        name: editedName,
        surname: editedSurname,
      });
      // Обновляем профиль вручную, включая full_name
      setProfile(prev => ({
        ...prev,
        ...updatedProfile.data,
        email: prev?.email || '', // сохраняем старый email
        full_name: `${updatedProfile.data.name} ${updatedProfile.data.surname}`,
      }));

      setIsEditing(false);
      Alert.alert('Успешно', 'Профиль обновлён');
    } catch (error: any) {
      console.error('Ошибка обновления профиля:', error);
      setErrorMessage(
        error?.response?.data?.message || 'Ошибка обновления профиля',
      );
    }
  };

  // Функция отмены редактирования: сбрасываем поля к текущим данным профиля
  const handleCancel = () => {
    if (profile) {
      setEditedName(profile.name);
      setEditedSurname(profile.surname);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 24,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{
                height: 24,
                width: 24,
              }}
              source={backArrow}
              alt="back arrow"
            />
          </TouchableOpacity>

          <Text style={{fontSize: 18}}>Редактирование профиля</Text>

          <View style={{width: 24, height: 24}}></View>
        </View>
        {/* // Profile */}
        <View
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 167,
            position: 'relative',
          }}>
          <Image
            source={profileImage}
            alt="proifle image"
            style={{width: 145, height: 145, borderRadius: 10000}}
          />

          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 0,
              marginHorizontal: 'auto',
            }}
            onPress={() => {
              Alert.alert('Вы меняете изображение');
            }}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 44,
                height: 44,
                backgroundColor: COLORS.white,
                borderRadius: 10000,
              }}>
              <Image
                style={{width: 24, height: 24}}
                source={penImage}
                alt="pen image"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
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
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              position: 'absolute',
              bottom: 0,
            }}>
            <Button onPress={handleSave}>Сохранить</Button>
            <Button variant='danger' onPress={handleLogout}>Выйти</Button>
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
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
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
