import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {LocationManager} from '@maplibre/maplibre-react-native';
import axiosInstance from '../../api/api.interceptor';
import {COLORS} from '../../constants/colors';

const LLMFAQScreen = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const location = await LocationManager.getLastKnownLocation();
      if (!location) throw new Error('Местоположение не получено');

      const res = await axiosInstance.get(
        'https://api.gisit-triggis-hackathon.ru/api/v1/user/ai/ask',
        {
          params: {
            question,
            route_id: 'Среднеколымск - Андрюшкино',
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        },
      );

      setAnswer(res.data.answer || 'Нет ответа');
    } catch (err) {
      console.error(err);
      setAnswer('Ошибка при получении ответа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Задать вопрос</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите вопрос..."
            placeholderTextColor="#999"
            multiline
            value={question}
            onChangeText={setQuestion}
          />
          <TouchableOpacity onPress={askQuestion} style={styles.askButton}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.askText}>Спросить</Text>
            )}
          </TouchableOpacity>

          {answer !== '' && (
            <View style={styles.answerBlock}>
              <Text style={styles.answerLabel}>Ответ:</Text>
              <Text style={styles.answerText}>{answer}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LLMFAQScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#222',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  askButton: {
    backgroundColor: COLORS['primary-default'] || '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  askText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  answerBlock: {
    marginTop: 24,
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 12,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  answerText: {
    fontSize: 15,
    color: '#333',
  },
});
