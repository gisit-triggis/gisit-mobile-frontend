import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MarkService} from '../../services/mark/mark.service';
import {IMark} from '../../interfaces/mark';
import {useNavigation} from '@react-navigation/native';
import backArrow from '../../static/arrow-left.png';
import MarkItem from '../ui/mark-item';
import {COLORS} from '../../constants/colors';
import {ScrollView} from 'react-native-gesture-handler';

const MyMarksScreen: React.FC = () => {
  const [marks, setMarks] = useState<IMark[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await MarkService.getMy();
        // response.data – массив меток
        setMarks(response.data);
      } catch (error) {
        console.error('Ошибка получения меток', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1, paddingHorizontal: 16, backgroundColor: COLORS.white}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 24,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{height: 24, width: 24}} source={backArrow} />
        </TouchableOpacity>
        <Text style={{fontSize: 18}}>Мои метки</Text>
        <View style={{width: 24, height: 24}} />
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Мои метки</Text>

        <View style={styles.marks_container}>
          {loading ? (
            <Text>Загрузка...</Text>
          ) : (
            marks.map(mark => <MarkItem key={mark.id} marker={mark} />)
            // <FlatList
            //   data={marks}
            //   keyExtractor={item => item.id}
            //   renderItem={Mark}
            //   contentContainerStyle={styles.listContent}
            // />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyMarksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  marks_container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  markCard: {
    backgroundColor: '#F1F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  markDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  markType: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  markCoords: {
    fontSize: 14,
    color: '#777',
  },
});
