import {FC, ReactNode} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {COLORS} from '../../constants/colors';
import {Text} from 'react-native-gesture-handler';

interface IButtonProps extends TouchableOpacityProps {
  children?: ReactNode;
  variant?: 'default' | 'secondary' | 'danger';
  type?: 'link';
}

const Button: FC<IButtonProps> = ({children, variant = 'default', ...rest}) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: COLORS['primary-default'],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...rest}>
      <Text style={{color: COLORS.white}}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
