import {
  Camera,
  CameraRef,
  LocationManager,
  MapView,
  UserLocation,
} from '@maplibre/maplibre-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

const MapScreen = () => {
  const [locationGranted, setLocationGranted] = useState(false);
  const cameraRef = useRef<CameraRef>(null);
  const [currentZoom, setCurrentZoom] = useState(12);

  const center = {lng: 10.0, lat: 50.0};
  let zoom = 12;
  let pitch = 70;
  let maxPitch = 85;
  const styleUrl =
    'https://api.maptiler.com/maps/streets/style.json?key=r8lhIWYHOsXCted9dVIj';
  const demTilesUrl =
    'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=r8lhIWYHOsXCted9dVIj';
  let exaggeration = 1.5;

  // Запрашиваем разрешения
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
      setLocationGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      setLocationGranted(true);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (locationGranted) {
      LocationManager.start();
    }

    return () => {
      LocationManager.stop();
    };
  }, [locationGranted]);

  const goToUserLocation = async () => {
    if (!locationGranted) {
      console.log('Нет разрешения на геолокацию');
      return;
    }

    const location = await LocationManager.getLastKnownLocation();

    if (location && cameraRef.current) {
      const {longitude, latitude} = location.coords;

      cameraRef.current.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: 18,
        animationDuration: 1000,
      });

      setCurrentZoom(14);
    } else {
      console.log('Геопозиция не получена');
    }
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      const newZoom = Math.min(currentZoom + 1, 20);
      cameraRef.current.zoomTo(newZoom, 500);
      setCurrentZoom(newZoom);
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      const newZoom = Math.max(currentZoom - 1, 1);
      cameraRef.current.zoomTo(newZoom, 500);
      setCurrentZoom(newZoom);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <MapView style={styles.map} mapStyle={styleUrl} pitchEnabled>
        <Camera
          ref={cameraRef}
          pitch={70} // только pitch можно оставить
        />
        <UserLocation visible={true} renderMode="native" />
      </MapView>

      {/* Кнопка геолокации */}
      <TouchableOpacity style={styles.locateButton} onPress={goToUserLocation}>
        <Text style={styles.buttonText}>📍 Местоположение</Text>
      </TouchableOpacity>

      {/* Кнопки зума */}
      <View style={styles.zoomButtons}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomText}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomText}>－</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locateButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  zoomButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'center',
    gap: 10,
  },
  zoomButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  zoomText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 24,
  },
});

export default MapScreen;
