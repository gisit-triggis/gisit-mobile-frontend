import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {IRoute} from '../../interfaces/Route';
import {COLORS} from '../../constants/colors';
import {FC} from 'react';

import carImage from '../../static/car.png';
import {formatIsoDate} from '../lib/uitls';

interface IRouteProps {
  route: IRoute;
}

const MarkItem: FC<IRouteProps> = ({route}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.dateContainer}>
        <Image style={styles.image} source={carImage} alt="Route type" />

        <Text>{formatIsoDate(route.created_at)}</Text>
      </View>
      <Text style={styles.title}>Описание {route.description}</Text>
      <Text style={styles.type}>Тип: {route.type}</Text>
      <Text style={styles.coordinates}>
        Координаты: {route.geometry.coordinates.join(', ')}
      </Text>
    </TouchableOpacity>
  );
};

export default RouteItem;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    gap: 16,
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
  title: {},
  type: {},
  coordinates: {},
});
