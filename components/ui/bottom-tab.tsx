import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Button from './button';
import personImage from '../../static/person.png';
import flagImage from '../../static/flag.png';
// Импортируем CityService и интерфейс ICity
import {CityService} from '../../services/city/city.service';
import {ICity} from '../../interfaces/city';

const BottomPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'route' | 'markers'>('route');

  // Состояния для точки А
  const [pointAQuery, setPointAQuery] = useState('');
  const [pointASuggestions, setPointASuggestions] = useState<ICity[]>([]);
  const [selectedPointA, setSelectedPointA] = useState<ICity | null>(null);

  // Состояния для точки Б
  const [pointBQuery, setPointBQuery] = useState('');
  const [pointBSuggestions, setPointBSuggestions] = useState<ICity[]>([]);
  const [selectedPointB, setSelectedPointB] = useState<ICity | null>(null);

  // Функция для запроса городов по введённому тексту
  const fetchCities = async (query: string): Promise<ICity[]> => {
    if (!query) return [];
    try {
      const result = await CityService.searchCity(query);
      // Данные городов находятся в result.data.data согласно вашему примеру
      return result.data.data;
    } catch (error) {
      console.error('Ошибка поиска города:', error);
      return [];
    }
  };

  // Эффект для автодополнения для точки А с задержкой 1 сек
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (pointAQuery && !selectedPointA) {
        fetchCities(pointAQuery).then(suggestions => {
          setPointASuggestions(suggestions);
        });
      } else {
        setPointASuggestions([]);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [pointAQuery, selectedPointA]);

  // Эффект для автодополнения для точки Б с задержкой 1 сек
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (pointBQuery && !selectedPointB) {
        fetchCities(pointBQuery).then(suggestions => {
          setPointBSuggestions(suggestions);
        });
      } else {
        setPointBSuggestions([]);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [pointBQuery, selectedPointB]);

  return (
    <View style={styles.bottomSheet}>
      <View style={styles.line} />
      <View style={styles.tabs}>
        <TouchableOpacity
          style={activeTab === 'route' ? styles.tabActive : styles.tabInactive}
          onPress={() => setActiveTab('route')}>
          <Text style={styles.tabText}>Маршрут</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            activeTab === 'markers' ? styles.tabActive : styles.tabInactive
          }
          onPress={() => setActiveTab('markers')}>
          <Text style={styles.tabText}>Метки</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'route' ? (
        <View>
          {/* Поле для точки А */}
          <View style={styles.inputRow}>
            <Image source={personImage} style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="Точка А"
                placeholderTextColor="#999"
                value={selectedPointA ? selectedPointA.title : pointAQuery}
                onChangeText={text => {
                  setPointAQuery(text);
                  setSelectedPointA(null);
                }}
              />
              {pointASuggestions.length > 0 && !selectedPointA && (
                <FlatList
                  data={pointASuggestions}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        setSelectedPointA(item);
                        setPointAQuery(item.title);
                        setPointASuggestions([]);
                      }}>
                      <Text style={styles.suggestionText}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                />
              )}
            </View>
          </View>

          {/* Поле для точки Б */}
          <View style={styles.inputRow}>
            <Image source={flagImage} style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="Точка Б"
                placeholderTextColor="#999"
                value={selectedPointB ? selectedPointB.title : pointBQuery}
                onChangeText={text => {
                  setPointBQuery(text);
                  setSelectedPointB(null);
                }}
              />
              {pointBSuggestions.length > 0 && !selectedPointB && (
                <FlatList
                  data={pointBSuggestions}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        setSelectedPointB(item);
                        setPointBQuery(item.title);
                        setPointBSuggestions([]);
                      }}>
                      <Text style={styles.suggestionText}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                />
              )}
            </View>
          </View>

          <Button
            onPress={() => {
              if (selectedPointA && selectedPointB)
                Alert.alert(
                  selectedPointA.geometry.coordinates.toString(),
                  selectedPointB.geometry.coordinates.toString(),
                );
            }}>
            Проложить маршрут
          </Button>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <Text style={styles.inputText}>Метки появятся здесь</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    width: '50%',
    height: 5,
    borderRadius: 10,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 12,
  },
  bottomSheet: {
    marginTop: -24,
    position: 'relative',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tabActive: {
    flex: 1,
    backgroundColor: '#E9F1F9',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  tabInactive: {
    flex: 1,
    backgroundColor: '#F1F4F6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#0F1C2E',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F4F6',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  inputIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 12,
    marginTop: 4,
  },
  inputContainer: {
    flex: 1,
    position: 'relative', // для абсолютного позиционирования списка подсказок
  },
  inputText: {
    fontSize: 16,
    color: '#0F1C2E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  suggestionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 10,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#0F1C2E',
  },
});

export default BottomPanel;
