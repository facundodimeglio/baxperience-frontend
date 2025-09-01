import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ViewStyle,
  Platform,
  ScrollView,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

interface CustomDatePickerProps {
  label?: string;
  placeholder?: string;
  selectedDate?: Date | null;
  onDateSelect: (date: Date) => void;
  error?: string;
  containerStyle?: ViewStyle;
  mode?: 'date' | 'birthdate';
  minimumDate?: Date;
  maximumDate?: Date;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  placeholder = 'Select date',
  selectedDate,
  onDateSelect,
  error,
  containerStyle,
  mode = 'date',
  minimumDate,
  maximumDate,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Initialize with current date or selected date
  const initDate = selectedDate || new Date();
  const [selectedDay, setSelectedDay] = useState(initDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(initDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(initDate.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  
  // Configure year range based on mode
  let minYear, maxYear;
  if (mode === 'birthdate') {
    minYear = currentYear - 100; // 100 years ago
    maxYear = currentYear - 13;  // 13 years ago
  } else {
    // For trip dates
    minYear = minimumDate ? minimumDate.getFullYear() : currentYear;
    maxYear = maximumDate ? maximumDate.getFullYear() : currentYear + 2; // Allow up to 2 years in future
  }
  
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const days = Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1);

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    
    // Validate against minimum and maximum dates
    if (minimumDate && newDate < minimumDate) {
      return; // Don't confirm invalid date
    }
    if (maximumDate && newDate > maximumDate) {
      return; // Don't confirm invalid date
    }
    
    onDateSelect(newDate);
    setIsVisible(false);
  };

  const handleCancel = () => {
    if (selectedDate) {
      setSelectedDay(selectedDate.getDate());
      setSelectedMonth(selectedDate.getMonth());
      setSelectedYear(selectedDate.getFullYear());
    } else {
      const today = new Date();
      setSelectedDay(today.getDate());
      setSelectedMonth(today.getMonth());
      setSelectedYear(today.getFullYear());
    }
    setIsVisible(false);
  };

  const handleOpen = () => {
    // Reset to current values when opening
    if (selectedDate) {
      setSelectedDay(selectedDate.getDate());
      setSelectedMonth(selectedDate.getMonth());
      setSelectedYear(selectedDate.getFullYear());
    }
    setIsVisible(true);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dateInput,
          error ? styles.dateInputError : null,
        ]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dateText,
          !selectedDate && styles.placeholderText
        ]}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCancel}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}} // Prevent closing when tapping inside modal
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'birthdate' ? 'Select Date of Birth' : 'Select Date'}
              </Text>
            </View>
            
            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Day</Text>
                <ScrollViewPicker
                  items={days.map(d => d.toString())}
                  selectedValue={selectedDay.toString()}
                  onValueChange={(value) => setSelectedDay(parseInt(value))}
                />
              </View>
              
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Month</Text>
                <ScrollViewPicker
                  items={months}
                  selectedValue={months[selectedMonth]}
                  onValueChange={(value) => setSelectedMonth(months.indexOf(value))}
                />
              </View>
              
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Year</Text>
                <ScrollViewPicker
                  items={years.map(y => y.toString())}
                  selectedValue={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

interface ScrollViewPickerProps {
  items: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const ScrollViewPicker: React.FC<ScrollViewPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
}) => {
  const selectedIndex = items.indexOf(selectedValue);

  return (
    <ScrollView 
      style={styles.scrollPicker}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.scrollPickerContent}
      nestedScrollEnabled={true} // Important for nested scrolling
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.pickerItem,
            selectedValue === item && styles.selectedPickerItem
          ]}
          onPress={() => onValueChange(item)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.pickerItemText,
            selectedValue === item && styles.selectedPickerItemText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
  dateInput: {
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.primary.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputError: {
    borderColor: palette.error.main,
  },
  dateText: {
    fontSize: 16,
    color: palette.text.primary,
    flex: 1,
  },
  placeholderText: {
    color: palette.text.disabled,
  },
  calendarIcon: {
    fontSize: 16,
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: palette.background.default,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: palette.secondary.dark,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
  },
  pickerContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.secondary,
    marginBottom: 10,
  },
  scrollPicker: {
    height: 200,
    maxHeight: 200,
    width: '100%',
  },
  scrollPickerContent: {
    paddingVertical: 10,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 6,
  },
  selectedPickerItem: {
    backgroundColor: palette.primary.main,
    borderRadius: 6,
  },
  pickerItemText: {
    fontSize: 16,
    color: palette.text.primary,
  },
  selectedPickerItemText: {
    color: palette.secondary.main,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: palette.background.paper,
    borderWidth: 1,
    borderColor: palette.primary.light,
  },
  confirmButton: {
    backgroundColor: palette.primary.main,
  },
  cancelButtonText: {
    color: palette.text.primary,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: palette.secondary.main,
    fontWeight: '600',
  },
});
