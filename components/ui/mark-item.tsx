import React, {FC} from 'react';
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';
import {IMark} from '../../interfaces/mark';
import {COLORS} from '../../constants/colors';
import {formatIsoDate} from '../lib/uitls';
import recommendImage from '../../static/recommend.png';
import warningImage from '../../static/warning.png';
import dangerImage from '../../static/danger.png';
import {useNavigation} from '@react-navigation/native';

interface IMarkProps {
  marker: IMark;
}

const MarkItem: FC<IMarkProps> = ({marker}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Переход на экран "main" (MapScreen) и передача метки через параметры маршрута
    navigation.navigate('main', {marker});
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.dateContainer}>
        <Image
          style={styles.image}
          source={
            marker.type === 'recommend'
              ? recommendImage
              : marker.type === 'danger'
              ? dangerImage
              : warningImage
          }
        />
        <Text>{formatIsoDate(marker.created_at)}</Text>
      </View>
      <Text style={styles.title}>Описание: {marker.description}</Text>
      <Text style={styles.type}>
        Тип:{' '}
        {marker.type === 'recommend'
          ? 'Рекомендация'
          : marker.type === 'danger'
          ? 'Опасность'
          : 'Предупреждение'}
      </Text>
      <Text style={styles.coordinates}>
        Координаты: {marker.geometry.coordinates.join(', ')}
      </Text>
    </TouchableOpacity>
  );
};

export default MarkItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginBottom: 12,
  },
  image: {
    height: 45,
    width: 73,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {fontWeight: '600', fontSize: 18},
  type: {fontSize: 16, marginVertical: 4},
  coordinates: {fontSize: 14, color: '#777'},
});
