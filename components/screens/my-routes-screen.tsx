import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backArrow from '../../static/arrow-left.png';
import {useNavigation} from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';

interface SavedRoute {
  id: string;
  from: string;
  to: string;
  image: string;
}

const STORAGE_KEY = 'routes';

const MyRoutesScreen = () => {
  const navigation = useNavigation();
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadRoutes = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed: SavedRoute[] = JSON.parse(json);
        setRoutes(parsed);
      }
    } catch (err) {
      console.error('Ошибка при загрузке маршрутов:', err);
    }
  };

  const deleteRoute = (id: string) => {
    Alert.alert('Удалить маршрут', 'Вы уверены, что хотите удалить маршрут?', [
      {text: 'Отмена', style: 'cancel'},
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedRoutes = routes.filter(route => route.id !== id);
            setRoutes(updatedRoutes);
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(updatedRoutes),
            );
          } catch (err) {
            console.error('Ошибка при удалении маршрута:', err);
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRoutes();
    setRefreshing(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadRoutes);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={backArrow} />
        </TouchableOpacity>
        <Text style={styles.title}>Мои пути</Text>
        <View style={styles.backIcon} />
      </View>

      <ScrollView
        contentContainerStyle={styles.routesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {routes.length === 0 ? (
          <Text style={styles.emptyText}>Список маршрутов пуст</Text>
        ) : (
          routes.map(route => (
            <TouchableOpacity
              key={route.id}
              onLongPress={() => deleteRoute(route.id)}
              delayLongPress={400}
              style={styles.routeCard}>
              <Text style={styles.routeText}>Из: {route.from}</Text>
              <Text style={styles.routeText}>В: {route.to}</Text>
              <TouchableOpacity onPress={() => setPreviewImage(route.image)}>
                <Image
                  source={{uri: route.image}}
                  style={styles.routeImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Модальное окно предпросмотра с zoom */}
      <Modal visible={!!previewImage} transparent>
        <ImageViewer
          imageUrls={[{url: previewImage || ''}]}
          onCancel={() => setPreviewImage(null)}
          enableSwipeDown
          onSwipeDown={() => setPreviewImage(null)}
          renderIndicator={() => null}
          saveToLocalByLongPress={false}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default MyRoutesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
  },
  backIcon: {
    height: 24,
    width: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  routesList: {
    paddingBottom: 24,
  },
  routeCard: {
    backgroundColor: '#F1F4F6',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  routeText: {
    fontSize: 16,
    color: '#0F1C2E',
    marginBottom: 6,
  },
  routeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 32,
  },
});
