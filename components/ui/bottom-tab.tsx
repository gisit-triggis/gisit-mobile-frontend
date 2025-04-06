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
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './button';
import personImage from '../../static/person.png';
import flagImage from '../../static/flag.png';
import {CityService} from '../../services/city/city.service';
import {MarkService} from '../../services/mark/mark.service';
import {RouteService} from '../../services/route/route.service';
import {ICity} from '../../interfaces/city';
import {IMark} from '../../interfaces/mark';
import MarkItem from './mark-item';
import {useNavigation} from '@react-navigation/native';
import {getBoundingPolygon} from '../lib/uitls';
import axios from 'axios';
import ImageViewer from 'react-native-image-zoom-viewer';

interface BottomPanelProps {
  onSelectPointA: (point: ICity) => void;
  onSelectPointB: (point: ICity) => void;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
  onSelectPointA,
  onSelectPointB,
}) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'route' | 'markers'>('route');

  const [pointAQuery, setPointAQuery] = useState('');
  const [pointASuggestions, setPointASuggestions] = useState<ICity[]>([]);
  const [selectedPointA, setSelectedPointA] = useState<ICity | null>(null);

  const [pointBQuery, setPointBQuery] = useState('');
  const [pointBSuggestions, setPointBSuggestions] = useState<ICity[]>([]);
  const [selectedPointB, setSelectedPointB] = useState<ICity | null>(null);

  const [marks, setMarks] = useState<IMark[]>([]);
  const [loading, setLoading] = useState(false);
  const [routeImage, setRouteImage] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    if (activeTab === 'markers') {
      MarkService.getMy()
        .then(res => {
          setMarks(res.data);
        })
        .catch(err => console.error('Ошибка загрузки меток', err));
    }
  }, [activeTab]);

  const fetchCities = async (query: string): Promise<ICity[]> => {
    if (!query) return [];
    try {
      const result = await CityService.searchCity(query);
      return result.data.data;
    } catch (error) {
      console.error('Ошибка поиска города:', error);
      return [];
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (pointAQuery && !selectedPointA) {
        fetchCities(pointAQuery).then(setPointASuggestions);
      } else {
        setPointASuggestions([]);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [pointAQuery, selectedPointA]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (pointBQuery && !selectedPointB) {
        fetchCities(pointBQuery).then(setPointBSuggestions);
      } else {
        setPointBSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [pointBQuery, selectedPointB]);

  const handleRouteSubmit = async () => {
    if (!selectedPointA || !selectedPointB) return;

    const start = selectedPointA.geometry.coordinates;
    const end = selectedPointB.geometry.coordinates;

    const geojson_geometry = getBoundingPolygon(start, end);

    setLoading(true);
    setRouteImage(null);

    try {
      const response = await RouteService.postRoute({
        geojson_geometry,
        start_point_lon_lat: start,
        end_point_lon_lat: end,
      });
      Alert.alert('Успех', 'Маршрут успешно отправлен на сервер');
      console.log('Route response:', response);

      if (response?.data?.image) {
        const image = response.data.image;
        setRouteImage(image);

        const newRoute = {
          id: Date.now().toString(),
          from: selectedPointA.title,
          to: selectedPointB.title,
          image,
          routes: response.data.routes,
        };

        const existingRoutes = await AsyncStorage.getItem('routes');
        const routes = existingRoutes ? JSON.parse(existingRoutes) : [];
        routes.push(newRoute);
        await AsyncStorage.setItem('routes', JSON.stringify(routes));
      }
    } catch (e: any) {
      console.error('Ошибка при отправке маршрута:', e);
      if (axios.isAxiosError(e)) {
        const details = e.response?.data || e.message;
        Alert.alert(
          'Ошибка',
          `Не удалось отправить маршрут: ${JSON.stringify(details, null, 2)}`,
        );
      } else {
        Alert.alert('Ошибка', 'Неизвестная ошибка при отправке маршрута');
      }
    } finally {
      setLoading(false);
    }
  };

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
        <>
          {/* Inputs */}
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
                        onSelectPointA(item);
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
                        onSelectPointB(item);
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

          <Button onPress={handleRouteSubmit}>Проложить маршрут</Button>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#007AFF"
              style={{marginTop: 12}}
            />
          )}
          {routeImage && (
            <TouchableOpacity onPress={() => setPreviewVisible(true)}>
              <Image
                source={{uri: routeImage}}
                style={{
                  width: '100%',
                  height: 200,
                  marginTop: 12,
                  borderRadius: 12,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          {/* Fullscreen preview */}
          <Modal visible={previewVisible} transparent>
            <ImageViewer
              imageUrls={[{url: routeImage || ''}]}
              onCancel={() => setPreviewVisible(false)}
              enableSwipeDown
              onSwipeDown={() => setPreviewVisible(false)}
              renderIndicator={() => null}
              saveToLocalByLongPress={false}
            />
          </Modal>
        </>
      ) : (
        <ScrollView style={{maxHeight: 250}}>
          {marks.map(mark => (
            <TouchableOpacity
              key={mark.id}
              onPress={() =>
                navigation.navigate('main', {
                  marker: mark,
                })
              }>
              <MarkItem marker={mark} />
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    position: 'relative',
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
