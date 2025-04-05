import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import routeImage from '../../static/pen.png';
import markerImage from '../../static/pen.png';
import personImage from '../../static/person.png';
import flagImage from '../../static/flag.png';
import Button from './button';

const BottomPanel = () => {
  const [activeTab, setActiveTab] = useState<'route' | 'markers'>('route');

  return (
    <View style={styles.bottomSheet}>
      <View style={styles.line}></View>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={activeTab === 'route' ? styles.tabActive : styles.tabInactive}
          onPress={() => setActiveTab('route')}>
          <Text style={styles.tabText}>Маршрут</Text>
          {/* <Image source={routeImage} style={styles.tabIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={
            activeTab === 'markers' ? styles.tabActive : styles.tabInactive
          }
          onPress={() => setActiveTab('markers')}>
          <Text style={styles.tabText}>Метки</Text>
          {/* <Image source={markerImage} style={styles.tabIcon} /> */}
        </TouchableOpacity>
      </View>

      {activeTab === 'route' ? (
        <View>
          <View style={styles.inputRow}>
            <Image source={personImage} style={styles.inputIcon} />
            <Text style={styles.inputText}>Точка А</Text>
          </View>
          <View style={styles.inputRow}>
            <Image source={flagImage} style={styles.inputIcon} />
            <Text style={styles.inputText}>Точка Б</Text>
          </View>
          <Button>Проложить маршрут</Button>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <Text style={styles.inputText}>Метки появятся здесь</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    width: '50%',
    height: 5,
    borderRadius: 10,
    backgroundColor: '#F4F7F9',
    marginHorizontal: 'auto',
  },
  bottomSheet: {
    marginTop: -24,
    position: 'relative',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  tabActive: {
    flex: 1,
    backgroundColor: '#E9F1F9',
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
    paddingVertical: 16,
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
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  routeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default BottomPanel;
