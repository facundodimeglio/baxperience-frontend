import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  selectedValue,
  onSelect,
  error,
  containerStyle,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dropdown,
          error ? styles.dropdownError : null,
        ]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownText,
          !selectedOption && styles.placeholderText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || 'Select an option'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    selectedValue === option.value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedValue === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {selectedValue === option.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  dropdown: {
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.primary.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownError: {
    borderColor: palette.error.main,
  },
  dropdownText: {
    fontSize: 16,
    color: palette.text.primary,
    flex: 1,
  },
  placeholderText: {
    color: palette.text.disabled,
  },
  arrow: {
    fontSize: 12,
    color: palette.text.disabled,
    marginLeft: 8,
  },
  errorText: {
    color: palette.error.main,
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: palette.background.default,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: palette.secondary.dark,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: palette.text.disabled,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.background.paper,
  },
  selectedOption: {
    backgroundColor: palette.primary.light,
  },
  optionText: {
    fontSize: 16,
    color: palette.text.primary,
    flex: 1,
  },
  selectedOptionText: {
    color: palette.secondary.main,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: palette.secondary.main,
    fontWeight: 'bold',
  },
});
