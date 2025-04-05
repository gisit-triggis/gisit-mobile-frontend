import {FC, ReactNode} from 'react';
import {StyleSheet, Text, TextProps, View} from 'react-native';
import {COLORS} from '../../constants/colors';

interface ILinkProps extends TextProps {
  children?: ReactNode;
  color?: string;
  underline?: boolean;
}

const Link: FC<ILinkProps> = ({
  children,
  color = COLORS.text,
  underline = false,
  ...rest
}) => {
  return (
    <View>
      <Text
        style={{
          textDecorationStyle: 'solid',
          textDecorationColor: color,
          textDecorationLine: underline ? 'underline' : 'none',
          color: color,
        }}
        {...rest}>
        {children}
      </Text>
    </View>
  );
};

export default Link;

const styles = StyleSheet.create({});
