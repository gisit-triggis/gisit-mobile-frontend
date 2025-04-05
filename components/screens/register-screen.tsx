import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from '../../services/auth/auth.service';
import authbg from '../../static/authbg.jpg';
import {COLORS} from '../../constants/colors';
import TextField from '../ui/textfield';
import Button from '../ui/button';
import Link from '../ui/link';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
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
      await AuthService.register({email, password});
      navigation.navigate('main', {
        screen: 'profile',
      });
    } catch (error: any) {
      console.error('Ошибка регистрации:', error);
      setErrorMessage(
        error?.response?.data?.message ||
          'Ошибка регистрации. Повторите попытку.',
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
          Регистрация
        </Text>

        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
          <TextField
            keyboardType="email-address"
            textContentType={'emailAddress'}
            label="Электронная почта"
            placeholder="example@gmail.com"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            textContentType="password"
            label="Пароль"
            placeholder="Пароль"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button onPress={handleRegister}>Зарегистрироваться</Button>

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
            onPress={() => navigation.navigate('login')}
            color={COLORS['primary-default']}>
            Войти
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
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
