import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MenuButton from '../ui/menu-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import backArrow from '../../static/arrow-left.png';
import {useNavigation} from '@react-navigation/native';

const MyRoutesScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{}}>
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
        <Text style={{fontSize: 18}}>Мои пути</Text>
        <View style={{width: 24, height: 24}} />
      </View>
      <Text>MyRoutesScreen</Text>
    </SafeAreaView>
  );
};

export default MyRoutesScreen;

const styles = StyleSheet.create({});
