import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  ViewStyle,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          props.style,
        ]}
        placeholderTextColor={palette.text.disabled}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    color: palette.text.primary,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: palette.text.primary,
    borderWidth: 1,
    borderColor: palette.primary.light,
  },
  inputError: {
    borderColor: palette.error.main,
  },
  errorText: {
    color: palette.error.main,
    fontSize: 12,
    marginTop: 4,
  },
});