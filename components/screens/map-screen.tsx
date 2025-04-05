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
import routeImage from '../../static/pen.png';
import markerImage from '../../static/pen.png';
import personImage from '../../static/user.png';
import flagImage from '../../static/pen.png';
import {useNavigation} from '@react-navigation/native';

const MapScreen = () => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [centerCoord, setCenterCoord] = useState<[number, number]>([
    129.733, 62.028,
  ]);
  const cameraRef = useRef<CameraRef>(null);
  const navigation = useNavigation();

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

    return () => {
      LocationManager.stop();
    };
  }, []);

  const goToUserLocation = async () => {
    if (!locationGranted) {
      console.log('Нет разрешения на геолокацию');
      return;
    }

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
    } else {
      console.log('Геопозиция не получена');
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(currentZoom + 1, 20);
    setCurrentZoom(newZoom);

    cameraRef.current?.setCamera({
      zoomLevel: newZoom,
      centerCoordinate: centerCoord,
      animationDuration: 400,
    });
  };

  const zoomOut = () => {
    const newZoom = Math.max(currentZoom - 1, 1);
    setCurrentZoom(newZoom);

    cameraRef.current?.setCamera({
      zoomLevel: newZoom,
      centerCoordinate: centerCoord,
      animationDuration: 400,
    });
  };

  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}>
        <Image source={menuImage} style={styles.menuIcon} />
      </TouchableOpacity>

      <MapView style={styles.map} mapStyle={styleUrl} pitchEnabled>
        <Camera
          ref={cameraRef}
          zoomLevel={currentZoom}
          centerCoordinate={centerCoord}
          pitch={pitch}
        />
        <UserLocation visible={true} renderMode="native" />
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

      <View style={styles.bottomPanel}>
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabText}>Маршрут</Text>
            <Image source={routeImage} style={styles.tabIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabInactive}>
            <Text style={styles.tabText}>Метки</Text>
            <Image source={markerImage} style={styles.tabIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <Image source={personImage} style={styles.inputIcon} />
          <Text style={styles.inputText}>Точка А</Text>
        </View>

        <View style={styles.inputRow}>
          <Image source={flagImage} style={styles.inputIcon} />
          <Text style={styles.inputText}>Точка Б</Text>
        </View>

        <TouchableOpacity style={styles.routeButton}>
          <Text style={styles.routeButtonText}>Проложить маршрут</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {flex: 1},
  controls: {
    position: 'absolute',
    bottom: 80,
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
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabActive: {
    flex: 1,
    backgroundColor: '#E9F1F9',
    marginRight: 8,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabInactive: {
    flex: 1,
    backgroundColor: '#F1F4F6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#0F1C2E',
    marginRight: 8,
  },
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  inputIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 12,
  },
  inputText: {
    fontSize: 16,
    color: '#0F1C2E',
  },
  routeButton: {
    backgroundColor: '#4CB723',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  routeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default MapScreen;
