import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../constants/colors';

const LLMFAQScreen = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.gisit-triggis-hackathon.ru/api/v1/llm/faq',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({prompt: question}),
        },
      );
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer('Произошла ошибка при получении ответа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <Text style={styles.title}>Задать вопрос</Text>
        <TextInput
          style={styles.input}
          placeholder="Напишите ваш вопрос..."
          value={question}
          onChangeText={setQuestion}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleAsk}
          disabled={loading}>
          <Text style={styles.buttonText}>Спросить</Text>
        </TouchableOpacity>

        <ScrollView style={styles.answerBox}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS['primary-default']} />
          ) : (
            <Text style={styles.answerText}>{answer}</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 120,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: COLORS['primary-default'],
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  answerBox: {
    marginTop: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default LLMFAQScreen;
