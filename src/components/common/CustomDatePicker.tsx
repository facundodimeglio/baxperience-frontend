import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ViewStyle,
  Platform,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

interface CustomDatePickerProps {
  label?: string;
  placeholder?: string;
  selectedDate?: Date | null;
  onDateSelect: (date: Date) => void;
  error?: string;
  containerStyle?: ViewStyle;
  minimumAge?: number;
  maximumAge?: number;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  placeholder = 'Select date',
  selectedDate,
  onDateSelect,
  error,
  containerStyle,
  minimumAge = 13,
  maximumAge = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(selectedDate?.getDate() || 1);
  const [selectedMonth, setSelectedMonth] = useState(selectedDate?.getMonth() || 0);
  const [selectedYear, setSelectedYear] = useState(selectedDate?.getFullYear() || new Date().getFullYear() - 25);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - maximumAge;
  const maxYear = currentYear - minimumAge;
  
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
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
    onDateSelect(newDate);
    setIsVisible(false);
  };

  const handleCancel = () => {
    if (selectedDate) {
      setSelectedDay(selectedDate.getDate());
      setSelectedMonth(selectedDate.getMonth());
      setSelectedYear(selectedDate.getFullYear());
    }
    setIsVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dateInput,
          error ? styles.dateInputError : null,
        ]}
        onPress={() => setIsVisible(true)}
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
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
          </View>
        </View>
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
  return (
    <View style={styles.scrollPicker}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.pickerItem,
            selectedValue === item && styles.selectedPickerItem
          ]}
          onPress={() => onValueChange(item)}
        >
          <Text style={[
            styles.pickerItemText,
            selectedValue === item && styles.selectedPickerItemText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
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
    height: 150,
    width: '100%',
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
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
