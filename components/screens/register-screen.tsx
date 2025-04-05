import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from '../../services/auth/auth.service';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <Button
        title="Уже есть аккаунт?"
        onPress={() => navigation.navigate('login')}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
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
