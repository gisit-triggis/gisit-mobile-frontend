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
import {useNavigation, useRoute} from '@react-navigation/native';
import BottomPanel from '../ui/bottom-tab';
import MenuButton from '../ui/menu-button';
import {MarkService} from '../../services/mark/mark.service';
import {IMark} from '../../interfaces/mark';
import dangerMarkerImage from '../../static/danger-mark.png';
import recommendMarkerImage from '../../static/recommend-mark.png';
import warningMarkerImage from '../../static/warning-mark.png';
import {formatIsoDate} from '../lib/uitls';
import MarkerCreationModal from '../ui/create-mark-modal';

const MapScreen = () => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [centerCoord, setCenterCoord] = useState<[number, number]>([
    129.733, 62.028,
  ]);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [marks, setMarks] = useState<IMark[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<IMark | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraRef>(null);
  const route = useRoute();
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

    return () => {
      LocationManager.stop();
    };
  }, []);

  useEffect(() => {
    if (route.params && (route.params as any).marker) {
      const marker = (route.params as any).marker;
      if (marker.geometry?.coordinates) {
        const [lon, lat] = marker.geometry.coordinates;
        setCenterCoord([lon, lat]);
        cameraRef.current?.setCamera({
          centerCoordinate: [lon, lat],
          zoomLevel: 18,
          animationDuration: 1000,
        });
        setSelectedMarker(marker);
      }
    }
  }, [route.params]);

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
      cameraRef.current.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: 18,
        animationDuration: 1000,
      });
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(currentZoom + 1, 20);
    setCurrentZoom(newZoom);
    cameraRef.current?.setCamera({zoomLevel: newZoom, animationDuration: 400});
  };

  const zoomOut = () => {
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
      <BottomPanel />

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
                MarkService.create(data)
                  .then(() => loadMarks())
                  .catch(error =>
                    console.error('Ошибка при создании метки', error),
                  );
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
