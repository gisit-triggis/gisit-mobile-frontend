import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {IProfileResponse, IUser} from '../../interfaces/user';
import {AuthService} from '../../services/auth/auth.service';
import {Text} from 'react-native-gesture-handler';
import Button from '../ui/button';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Профиль пользователя</Text>
        {isEditing ? (
          <View>
            <Text>Имя:</Text>
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Введите имя"
            />
            <Text>Фамилия:</Text>
            <TextInput
              style={styles.input}
              value={editedSurname}
              onChangeText={setEditedSurname}
              placeholder="Введите фамилию"
            />
            <View style={styles.buttonRow}>
              <Button onPress={handleSave}>Сохранить</Button>
              <Button onPress={handleCancel}>Отменить</Button>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.text}>Имя: {profile?.name}</Text>
            <Text style={styles.text}>Фамилия: {profile?.surname}</Text>
            <Text style={styles.text}>Email: {profile?.email}</Text>
            <Text style={styles.text}>Полное имя: {profile?.full_name}</Text>
            <View style={styles.buttonRow}>
              <Button onPress={() => setIsEditing(true)}>Изменить</Button>
            </View>
          </View>
        )}
        <Button variant='' onPress={handleLogout}>
          Выйти
        </Button>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
