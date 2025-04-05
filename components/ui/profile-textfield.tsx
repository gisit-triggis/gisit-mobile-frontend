import React, {FC} from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  Image,
} from 'react-native';
import {COLORS} from '../../constants/colors'; // твоя палитра

interface IProfileTextFieldProps extends TextInputProps {
  icon?: any;
}

const ProfileTextField: FC<IProfileTextFieldProps> = ({
  icon,
  style,
  ...props
}) => {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 16,
        backgroundColor: COLORS.background,
        padding: 16,
      }}>
      {icon && <Image source={icon} style={styles.icon} />}

      <View style={{width: '80%'}}>
        <TextInput style={{width: '100%', fontSize: 16}} {...props} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#0F1C2E',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#0F1C2E',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F1C2E',
  },
});

export default ProfileTextField;
