import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { palette } from '../../theme/colors/palette';
import { CustomButton } from '../../components/common/CustomButton';

const SelectedExperiencesScreen = ({ route, navigation }) => {
  const { selectedExperiences } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [experiences, setExperiences] = useState(selectedExperiences);

  const showExperienceDetails = (experience) => {
    setSelectedExperience(experience);
    setModalVisible(true);
  };

  const removeExperience = (experienceId) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
    setExperiences(updatedExperiences);
    
    if (updatedExperiences.length === 0) {
      Alert.alert(
        'Sin experiencias',
        'Has eliminado todas las experiencias seleccionadas',
        [
          { 
            text: 'Volver',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };

  const createItinerary = () => {
    // En un caso real, enviaríamos estos datos a una API para crear un itinerario
    // Por ahora, solo mostraremos una alerta de confirmación
    Alert.alert(
      '¡Itinerario Creado!',
      `Has creado un itinerario con ${experiences.length} experiencias.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomeScreen')
        }
      ]
    );
  };

  const getTotalDistance = () => {
    if (experiences.length === 0) return 0;
    
    const totalDistance = experiences.reduce(
      (sum, experience) => sum + parseFloat(experience.distance || 0), 
      0
    );
    
    return totalDistance.toFixed(1);
  };

  const renderExperienceItem = ({ item, index }) => {
    return (
      <View style={styles.experienceCard}>
        <View style={styles.experienceHeader}>
          <View style={styles.orderBadge}>
            <Text style={styles.orderText}>{index + 1}</Text>
          </View>
          <View style={styles.experienceImage}>
            <Text style={styles.experienceImageText}>{item.image}</Text>
          </View>
          <View style={styles.experienceContent}>
            <Text style={styles.experienceName}>{item.name}</Text>
            <Text style={styles.experienceType}>{item.type}</Text>
            {item.distance && (
              <Text style={styles.distanceText}>📍 {item.distance} km</Text>
            )}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showExperienceDetails(item)}
          >
            <Text style={styles.actionButtonText}>Ver detalles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => removeExperience(item.id)}
          >
            <Text style={styles.removeButtonText}>Quitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Experiencias Seleccionadas</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{experiences.length}</Text>
          <Text style={styles.statLabel}>Experiencias</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{getTotalDistance()}</Text>
          <Text style={styles.statLabel}>Km Totales</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.ceil(experiences.length * 1.5)}</Text>
          <Text style={styles.statLabel}>Horas aprox.</Text>
        </View>
      </View>

      {experiences.length > 0 ? (
        <FlatList
          data={experiences}
          keyExtractor={(item) => item.id}
          renderItem={renderExperienceItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay experiencias seleccionadas
          </Text>
          <CustomButton
            title="Buscar experiencias"
            onPress={() => navigation.goBack()}
            style={styles.emptyButton}
          />
        </View>
      )}

      {experiences.length > 0 && (
        <View style={styles.footer}>
          <CustomButton
            title="Crear Itinerario"
            onPress={createItinerary}
            style={styles.createButton}
          />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            {selectedExperience && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalImageContainer}>
                  <Text style={styles.modalImage}>{selectedExperience.image}</Text>
                </View>
                <Text style={styles.modalTitle}>{selectedExperience.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>
                    ★ {selectedExperience.rating}
                  </Text>
                </View>
                <Text style={styles.modalType}>{selectedExperience.type}</Text>
                {selectedExperience.distance && (
                  <Text style={styles.modalDistance}>
                    📍 A {selectedExperience.distance} km de tu ubicación
                  </Text>
                )}
                <Text style={styles.modalAddress}>{selectedExperience.address}</Text>
                <Text style={styles.modalDetailsTitle}>Detalles</Text>
                <Text style={styles.modalDetails}>{selectedExperience.details}</Text>
                
                <View style={styles.modalActions}>
                  <CustomButton
                    title="Quitar de selección"
                    onPress={() => {
                      removeExperience(selectedExperience.id);
                      setModalVisible(false);
                    }}
                    style={styles.removeModalButton}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background.default,
  },
  header: {
    backgroundColor: palette.primary.main,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.secondary.main,
    marginLeft: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    fontSize: 22,
    color: palette.secondary.main,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: palette.background.paper,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  experienceCard: {
    backgroundColor: palette.background.paper,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  experienceHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  orderBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  orderText: {
    color: palette.secondary.main,
    fontWeight: 'bold',
    fontSize: 14,
  },
  experienceImage: {
    width: 60,
    height: 60,
    backgroundColor: palette.primary.light,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  experienceImageText: {
    fontSize: 30,
  },
  experienceContent: {
    flex: 1,
  },
  experienceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  experienceType: {
    fontSize: 12,
    color: palette.text.secondary,
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    color: palette.primary.main,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: palette.primary.main,
    fontWeight: '600',
  },
  removeButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
  },
  removeButtonText: {
    fontSize: 14,
    color: '#FF5252',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  createButton: {
    backgroundColor: palette.primary.main,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: palette.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: palette.primary.main,
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalImageContainer: {
    height: 180,
    backgroundColor: palette.primary.light,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalImage: {
    fontSize: 80,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: 'bold',
  },
  modalType: {
    fontSize: 14,
    color: palette.text.secondary,
    marginBottom: 10,
  },
  modalDistance: {
    fontSize: 14,
    color: palette.primary.main,
    marginBottom: 10,
  },
  modalAddress: {
    fontSize: 14,
    color: palette.text.primary,
    marginBottom: 15,
  },
  modalDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 8,
    marginTop: 10,
  },
  modalDetails: {
    fontSize: 14,
    color: palette.text.primary,
    lineHeight: 22,
  },
  modalActions: {
    marginTop: 25,
    marginBottom: 10,
  },
  removeModalButton: {
    backgroundColor: '#FF5252',
  },
});

export default SelectedExperiencesScreen;
