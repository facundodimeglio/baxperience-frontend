import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

interface PreferenceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  style?: ViewStyle;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({
  id,
  title,
  description,
  icon,
  isSelected,
  onToggle,
  style,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(id);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Text style={[
              styles.icon,
              isSelected && styles.selectedIcon
            ]}>
              {icon}
            </Text>
            {isSelected && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[
              styles.title,
              isSelected && styles.selectedTitle
            ]}>
              {title}
            </Text>
            <Text style={[
              styles.description,
              isSelected && styles.selectedDescription
            ]}>
              {description}
            </Text>
          </View>
        </View>

        <View style={[
          styles.selectionIndicator,
          isSelected && styles.selectedIndicator
        ]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.background.default,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: palette.secondary.dark,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: palette.primary.main,
    backgroundColor: palette.primary.light + '10', // 10% opacity
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  icon: {
    fontSize: 28,
  },
  selectedIcon: {
    transform: [{ scale: 1.1 }],
  },
  checkmark: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.success.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: palette.secondary.main,
    fontSize: 12,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  selectedTitle: {
    color: palette.primary.main,
  },
  description: {
    fontSize: 14,
    color: palette.text.secondary,
    lineHeight: 20,
  },
  selectedDescription: {
    color: palette.text.primary,
  },
  selectionIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'transparent',
  },
  selectedIndicator: {
    backgroundColor: palette.primary.main,
  },
});
