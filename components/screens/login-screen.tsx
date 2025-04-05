import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from '../../services/auth/auth.service';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
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

      <Button title="Войти" onPress={handleLogin} />
      <Button
        title="Нет аккаунта?"
        onPress={() => navigation.navigate('register')}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
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
