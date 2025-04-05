import {
  Camera,
  CameraRef,
  LocationManager,
  MapView,
  UserLocation,
  ShapeSource,
  LineLayer,
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
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import menuImage from '../../static/menu.png';
import geoImage from '../../static/geo.png';
import routeImage from '../../static/route.png';
import markerImage from '../../static/marker.png';
import personImage from '../../static/person.png';
import flagImage from '../../static/flag.png';
import {useNavigation} from '@react-navigation/native';
import BottomPanel from '../ui/bottom-tab';

const MapScreen = () => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [centerCoord, setCenterCoord] = useState<[number, number]>([
    129.733, 62.028,
  ]);
  const cameraRef = useRef<CameraRef>(null);
  const navigation = useNavigation();

  // Состояние для данных GeoJSON
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  const pitch = 70;
  const styleUrl =
    'https://api.maptiler.com/maps/streets/style.json?key=r8lhIWYHOsXCted9dVIj';

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Геолокация',
          message:
            'Разрешите доступ к геопозиции для отображения вашего местоположения.',
          buttonPositive: 'Разрешить',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    requestLocationPermission().then(granted => {
      if (granted) {
        LocationManager.start();
        setLocationGranted(true);
      }
    });

    // Загружаем GeoJSON с указанного URL
    fetch('https://s3.gisit-triggis-hackathon.ru/filtered.geojson')
      .then(response => response.json())
      .then(data => {
        setGeoJsonData(data);
      })
      .catch(error => console.error('Ошибка загрузки GeoJSON:', error));

    return () => {
      LocationManager.stop();
    };
  }, []);

  const goToUserLocation = async () => {
    if (!locationGranted) return;
    const location = await LocationManager.getLastKnownLocation();
    if (location && cameraRef.current) {
      const {longitude, latitude} = location.coords;
      const newZoom = 18;
      setCurrentZoom(newZoom);
      setCenterCoord([longitude, latitude]);
      cameraRef.current.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: newZoom,
        animationDuration: 1000,
      });
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(currentZoom + 1, 20);
    setCurrentZoom(newZoom);
    cameraRef.current?.setCamera({
      zoomLevel: newZoom,
      animationDuration: 400,
    });
  };

  const zoomOut = () => {
    const newZoom = Math.max(currentZoom - 1, 1);
    setCurrentZoom(newZoom);
    cameraRef.current?.setCamera({
      zoomLevel: newZoom,
      animationDuration: 400,
    });
  };

  // Стиль для слоя с GeoJSON (линии)
  const layerStyle = {
    lineColor: '#FF0000',
    lineWidth: 2,
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}>
        <Image source={menuImage} style={styles.menuIcon} />
      </TouchableOpacity>

      <View style={styles.mapBlock}>
        <MapView style={styles.map} mapStyle={styleUrl} pitchEnabled>
          <Camera ref={cameraRef} zoomLevel={currentZoom} pitch={pitch} />
          <UserLocation visible={true} renderMode="native" />
          {/* Если данные GeoJSON загружены, отображаем их */}
          {geoJsonData && (
            <ShapeSource id="geojson-source" shape={geoJsonData}>
              <LineLayer id="geojson-line-layer" style={layerStyle} />
            </ShapeSource>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {flex: 1},
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
  menuButton: {
    position: 'absolute',
    top: 80,
    left: 16,
    backgroundColor: COLORS.white,
    width: 56,
    height: 56,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  menuIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  mapBlock: {
    flex: 1,
  },
});

export default MapScreen;
