import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {IMark} from '../../interfaces/mark';
import {COLORS} from '../../constants/colors';
import {FC} from 'react';

import recommendImage from '../../static/recommend.png';
import warningImage from '../../static/warning.png';
import dangerImage from '../../static/danger.png';
import {formatIsoDate} from '../lib/uitls';

interface IMarkProps {
  marker: IMark;
}

const MarkItem: FC<IMarkProps> = ({marker}) => {
  return (
    <TouchableOpacity style={styles.container}>
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
          alt="mark type"
        />

        <Text>{formatIsoDate(marker.created_at)}</Text>
      </View>
      <Text style={styles.title}>Описание {marker.description}</Text>
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
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    gap: 8,
  },
  image: {
    height: 45,
    width: 73,
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {fontWeight: 600, fontSize: 18},
  type: {},
  coordinates: {},
});
