import React, {FC} from 'react';
import {View, Text, TextInput, TextInputProps, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

interface ITextFieldProps extends TextInputProps {
  label: string;
}

const TextField: FC<ITextFieldProps> = ({label, style, ...props}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
      <Text style={{fontSize: 16}}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS['muted-border'],
    borderRadius: 8,
    paddingVertical: 10.5,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default TextField;
