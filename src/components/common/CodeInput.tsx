import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

interface CodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onCodeChange?: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  length = 6,
  onComplete,
  onCodeChange,
  error,
  autoFocus = true,
}) => {
  const [code, setCode] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (error) {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  const handleCodeChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length <= length) {
      setCode(numericText);
      setFocusedIndex(numericText.length);
      
      if (onCodeChange) {
        onCodeChange(numericText);
      }
      
      if (numericText.length === length) {
        onComplete(numericText);
        inputRef.current?.blur();
      }
    }
  };

  const handleBoxPress = (index: number) => {
    inputRef.current?.focus();
    setFocusedIndex(index);
  };

  const renderBoxes = () => {
    const boxes = [];
    
    for (let i = 0; i < length; i++) {
      const isActive = i === focusedIndex && code.length === i;
      const isFilled = i < code.length;
      const digit = code[i] || '';
      
      boxes.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.codeBox,
            isActive && styles.activeBox,
            isFilled && styles.filledBox,
            error && styles.errorBox,
          ]}
          onPress={() => handleBoxPress(i)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.codeText,
            isActive && styles.activeText,
            isFilled && styles.filledText,
            error && styles.errorText,
          ]}>
            {digit}
          </Text>
          {isActive && !isFilled && (
            <View style={styles.cursor} />
          )}
        </TouchableOpacity>
      );
    }
    
    return boxes;
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.boxContainer,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        {renderBoxes()}
      </Animated.View>
      
      {/* Hidden TextInput for handling input */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={handleCodeChange}
        keyboardType="numeric"
        maxLength={length}
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        onFocus={() => setFocusedIndex(code.length)}
        onBlur={() => setFocusedIndex(-1)}
      />
      
      {error && (
        <Text style={styles.errorMessage}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
  },
  codeBox: {
    width: 45,
    height: 55,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.secondary.dark,
    backgroundColor: palette.background.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    position: 'relative',
  },
  activeBox: {
    borderColor: palette.primary.main,
    backgroundColor: palette.background.paper,
    elevation: 3,
    shadowColor: palette.primary.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filledBox: {
    borderColor: palette.primary.main,
    backgroundColor: palette.primary.main,
  },
  errorBox: {
    borderColor: palette.error.main,
    backgroundColor: palette.error.light,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.text.disabled,
  },
  activeText: {
    color: palette.primary.main,
  },
  filledText: {
    color: palette.secondary.main,
  },
  errorText: {
    color: palette.error.main,
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: palette.primary.main,
    opacity: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorMessage: {
    color: palette.error.main,
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
});
