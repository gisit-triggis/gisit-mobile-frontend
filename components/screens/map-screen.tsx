// map-screen.tsx

import {
  Camera,
  CameraRef,
  LocationManager,
  MapView,
  UserLocation,
  ShapeSource,
  LineLayer,
  MarkerView,
} from '@maplibre/maplibre-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import geoImage from '../../static/geo.png';
import {useRoute} from '@react-navigation/native';
import BottomPanel from '../ui/bottom-tab';
import MenuButton from '../ui/menu-button';
import {MarkService} from '../../services/mark/mark.service';
import {ICity} from '../../interfaces/city';
import {IMark} from '../../interfaces/mark';
import dangerMarkerImage from '../../static/danger-mark.png';
import recommendMarkerImage from '../../static/recommend-mark.png';
import warningMarkerImage from '../../static/warning-mark.png';
import {formatIsoDate} from '../lib/uitls';
import MarkerCreationModal from '../ui/create-mark-modal';
import carImage from '../../static/car.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/api.interceptor';

interface IUserInMap {
  userId: string;
  lon: number;
  lat: number;
}

const MapScreen = () => {
  const [userPositions, setUserPosition] = useState<
    Record<string, {lon: number; lat: number}>
  >({});

  useEffect(() => {
    const connectWebSocket = async () => {
      const token = await AsyncStorage.getItem('sso');
      if (!token) return;

      const ws = new WebSocket(
        `wss://ws.gisit-triggis-hackathon.ru/ws?token=${token}`,
      );

      ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'position_update') {
            setUserPosition(prev => ({
              ...prev,
              [data.user_id]: {
                lon: data.lon,
                lat: data.lat,
              },
            }));
          } else if (data.type === 'init') {
            const initPositions: Record<string, {lon: number; lat: number}> =
              {};
            for (const p of data.positions) {
              initPositions[p.user_id] = {
                lon: p.lon,
                lat: p.lat,
              };
            }
            setUserPosition(initPositions);
          }
        } catch (e) {
          console.error('WebSocket error:', e);
        }
      };

      ws.onerror = err => console.error('WebSocket error', err);
      ws.onclose = () => console.log('WebSocket closed');

      return () => ws.close();
    };

    connectWebSocket();
  }, []);

  useEffect(() => {
    const sendPosition = async () => {
      const location = await LocationManager.getLastKnownLocation();
      if (location) {
        await axiosInstance({
          url: 'https://api.gisit-triggis-hackathon.ru/api/v1/user/gps',
          method: 'PATCH',
          data: JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }),
        }).catch(console.error);
      }
    };

    sendPosition();
    const interval = setInterval(sendPosition, 60000);
    return () => clearInterval(interval);
  }, []);

  const [locationGranted, setLocationGranted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [centerCoord, setCenterCoord] = useState<[number, number]>([
    129.733, 62.028,
  ]);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [marks, setMarks] = useState<IMark[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<IMark | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraRef>(null);
  const route = useRoute();
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPointA, setSelectedPointA] = useState<ICity | null>(null);
  const [selectedPointB, setSelectedPointB] = useState<ICity | null>(null);

  const pitch = 70;
  const styleUrl =
    'https://api.maptiler.com/maps/streets/style.json?key=r8lhIWYHOsXCted9dVIj';

  const loadMarks = async () => {
    setLoading(true);
    try {
      const res = await MarkService.getAll();
      setMarks(res.data);
    } catch (e) {
      console.error('Mark fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPermissionsAndData = async () => {
      const granted =
        Platform.OS === 'android'
          ? await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
          : true;

      if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
        LocationManager.start();
        setLocationGranted(true);
      }

      fetch('https://s3.gisit-triggis-hackathon.ru/filtered.geojson')
        .then(res => res.json())
        .then(setGeoJsonData)
        .catch(err => console.error('GeoJSON error:', err));

      loadMarks();
    };

    loadPermissionsAndData();
    return () => LocationManager.stop();
  }, []);

  useEffect(() => {
    if (route.params) {
      const {marker, selectedRoute} = route.params as any;

      if (marker?.geometry?.coordinates) {
        const [lon, lat] = marker.geometry.coordinates;
        setCenterCoord([lon, lat]);
        cameraRef.current?.setCamera({
          centerCoordinate: [lon, lat],
          zoomLevel: 18,
          animationDuration: 1000,
        });
        setSelectedMarker(marker);
      }

      if (selectedRoute) {
        setRouteGeoJson(selectedRoute);

        const coordinates = selectedRoute?.features?.[0]?.geometry?.coordinates;
        if (coordinates && coordinates.length > 0) {
          const [lon, lat] = coordinates[0];
          setCenterCoord([lon, lat]);
          cameraRef.current?.setCamera({
            centerCoordinate: [lon, lat],
            zoomLevel: 14,
            animationDuration: 1000,
          });
        }
      }
    }
  }, [route.params]);

  useEffect(() => {
    if (selectedPointA) {
      const [lon, lat] = selectedPointA.geometry.coordinates;
      cameraRef.current?.setCamera({
        centerCoordinate: [lon, lat],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [selectedPointA]);

  useEffect(() => {
    if (selectedPointB) {
      const [lon, lat] = selectedPointB.geometry.coordinates;
      cameraRef.current?.setCamera({
        centerCoordinate: [lon, lat],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [selectedPointB]);

  const handleRouteReady = (geojsonProp: any) => {
    console.log(
      '📦 routeGeojson from server:',
      JSON.stringify(geojsonProp, null, 2),
    );
    setRouteGeoJson(JSON.parse(geojsonProp));

    const coordinates = geojsonProp?.features?.[0]?.geometry?.coordinates;
    if (coordinates && coordinates.length > 0) {
      const [lon, lat] = coordinates[0];
      setCenterCoord([lon, lat]);
      cameraRef.current?.setCamera({
        centerCoordinate: [lon, lat],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  };

  const handleMapLongPress = (event: any) => {
    const coords = event.geometry?.coordinates;
    if (coords && coords.length === 2) {
      setSelectedCoordinates([coords[0], coords[1]]);
      setIsModalVisible(true);
    }
  };

  const goToUserLocation = async () => {
    if (!locationGranted) return;
    const location = await LocationManager.getLastKnownLocation();
    if (location && cameraRef.current) {
      const {longitude, latitude} = location.coords;
      setCurrentZoom(18); // 🔧 Обновляем состояние, чтобы зум был в синхронизации
      cameraRef.current.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: 18,
        animationDuration: 1000,
      });
    }
  };

  const zoomIn = () => {
    if (currentZoom + 1 > 20) return;
    const newZoom = Math.min(currentZoom + 1, 20);
    setCurrentZoom(newZoom);
    cameraRef.current?.setCamera({zoomLevel: newZoom, animationDuration: 400});
  };

  const zoomOut = () => {
    if (currentZoom - 1 < 1) return;
    const newZoom = Math.max(currentZoom - 1, 1);
    setCurrentZoom(newZoom);
    cameraRef.current?.setCamera({zoomLevel: newZoom, animationDuration: 400});
  };

  const getMarkerImage = (type: string) => {
    switch (type) {
      case 'danger':
        return dangerMarkerImage;
      case 'recommend':
        return recommendMarkerImage;
      default:
        return warningMarkerImage;
    }
  };

  const deleteSelectedMarker = async () => {
    if (!selectedMarker) return;
    try {
      await MarkService.delete(selectedMarker.id);
      setSelectedMarker(null);
      await loadMarks();
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось удалить метку');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <MenuButton />
      <View style={styles.mapBlock}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS['primary-default']} />
          </View>
        )}
        <MapView
          onLongPress={handleMapLongPress}
          style={styles.map}
          mapStyle={styleUrl}
          pitchEnabled>
          <Camera ref={cameraRef} zoomLevel={currentZoom} pitch={pitch} />
          <UserLocation visible={true} renderMode="native" />

          {geoJsonData && (
            <ShapeSource id="geojson-source" shape={geoJsonData}>
              <LineLayer id="geojson-line-layer" style={styles.lineStyle} />
            </ShapeSource>
          )}

          {routeGeoJson && (
            <>
              {console.log('🗺 Rendering routeGeoJson:', routeGeoJson)}
              <ShapeSource id="route-source" shape={routeGeoJson}>
                <LineLayer id="route-line-layer" style={styles.routeStyle} />
              </ShapeSource>
            </>
          )}

          {Object.entries(userPositions).map(([id, pos]) => (
            <MarkerView key={id} coordinate={[pos.lon, pos.lat]}>
              <Image source={carImage} style={{width: 32, height: 32}} />
            </MarkerView>
          ))}

          {marks.map(marker => (
            <MarkerView
              key={marker.id}
              coordinate={marker.geometry.coordinates}>
              <TouchableOpacity onPress={() => setSelectedMarker(marker)}>
                <Image
                  source={getMarkerImage(marker.type)}
                  style={{width: 32, height: 41}}
                />
              </TouchableOpacity>
            </MarkerView>
          ))}

          {selectedMarker && (
            <MarkerView
              key="popup"
              coordinate={selectedMarker.geometry.coordinates}>
              <View style={styles.popup}>
                <Text>
                  Тип:{' '}
                  {selectedMarker.type === 'recommend'
                    ? 'Рекомендация'
                    : selectedMarker.type === 'danger'
                    ? 'Опасность'
                    : 'Предупреждение'}
                </Text>
                <Text style={styles.popupText}>
                  Описание: {selectedMarker.description}
                </Text>
                <Text style={styles.popupText}>
                  {formatIsoDate(selectedMarker.created_at)}
                </Text>
                <TouchableOpacity
                  onPress={deleteSelectedMarker}
                  style={styles.deleteButton}>
                  <Text style={{color: 'white'}}>Удалить</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedMarker(null)}
                  style={styles.closeButton}>
                  <Text style={{color: 'white'}}>Закрыть</Text>
                </TouchableOpacity>
              </View>
            </MarkerView>
          )}
        </MapView>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.circleButton} onPress={zoomIn}>
            <Text style={styles.plus}>＋</Text>
          </TouchableOpacity>
          <View style={{height: 12}} />
          <TouchableOpacity style={styles.circleButton} onPress={zoomOut}>
            <View style={styles.minus} />
          </TouchableOpacity>
          <View style={{height: 12}} />
          <TouchableOpacity
            style={styles.circleButton}
            onPress={goToUserLocation}>
            <Image source={geoImage} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <BottomPanel
        onSelectPointA={setSelectedPointA}
        onSelectPointB={setSelectedPointB}
        onRouteReady={handleRouteReady}
      />

      <Modal
        transparent
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsModalVisible(false)}>
          <Pressable style={styles.modalContainer} onPress={() => {}}>
            <MarkerCreationModal
              visible={true}
              onClose={() => setIsModalVisible(false)}
              coordinates={selectedCoordinates}
              onCreated={data => {
                setIsModalVisible(false);
                setSelectedCoordinates(null);
                MarkService.create(data).then(() => loadMarks());
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {flex: 1},
  mapBlock: {flex: 1},
  lineStyle: {lineColor: '#FF0000', lineWidth: 2},
  routeStyle: {lineColor: '#1E90FF', lineWidth: 3},
  controls: {
    position: 'absolute',
    bottom: 40,
    right: 16,
  },
  circleButton: {
    backgroundColor: COLORS.white,
    width: 56,
    height: 56,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  plus: {fontSize: 32, color: '#000'},
  minus: {
    width: 20,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 1000,
  },
  menuIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    minWidth: 160,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  popupText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: 'gray',
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: 'red',
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    width: '80%',
    maxWidth: 400,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 100,
  },
});
