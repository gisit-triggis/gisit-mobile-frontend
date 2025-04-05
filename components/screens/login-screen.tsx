import {View, Text, TextInput, StyleSheet, ImageBackground} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from '../../services/auth/auth.service';
import authbg from '../../static/authbg.jpg';
import {COLORS} from '../../constants/colors';
import TextField from '../ui/textfield';
import Button from '../ui/button';
import Link from '../ui/link';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (email === '') {
      setErrorMessage('Введите почту');
      return;
    }
    if (password === '') {
      setErrorMessage('Введите пароль');
      return;
    }
    setErrorMessage('');
    try {
      await AuthService.login({email, password});
      navigation.navigate('main', {
        screen: 'profile',
      });
    } catch (error: any) {
      console.error('Ошибка входа:', error);
      setErrorMessage(
        error?.response?.data?.message || 'Неверный email или пароль',
      );
    }
  };

  return (
    <ImageBackground
      source={authbg}
      resizeMode="cover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 20,
      }}>
      <View
        style={{
          width: '100%',
          backgroundColor: COLORS.white,
          padding: 32,
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 600,
          }}>
          Авторизация
        </Text>

        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
          <TextField
            label="Электронная почта"
            placeholder="example@gmail.com"
            keyboardType="email-address"
            textContentType={'emailAddress'}
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            textContentType="password"
            label="Пароль"
            style={styles.input}
            placeholder="Пароль"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button onPress={handleLogin}>Войти</Button>

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
        </View>

        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Link underline>Забыли пароль?</Link>
          <Link
            onPress={() => navigation.navigate('register')}
            color={COLORS['primary-default']}>
            Регистрация
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {fontSize: 24, marginBottom: 16},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  error: {
    marginTop: 16,
    color: 'red',
    textAlign: 'center',
  },
});
