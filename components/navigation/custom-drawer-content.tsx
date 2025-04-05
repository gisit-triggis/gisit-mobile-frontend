import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Text} from 'react-native';

export function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <Text>View</Text>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
