import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { palette } from '../../theme/colors/palette';
import { CustomButton } from '../../components/common/CustomButton';

// Usamos un cálculo simple para distancias
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; // Distancia en km
  return distance.toFixed(1);
};

// Datos de ejemplo de experiencias (en un proyecto real, vendrían de una API)
const mockExperiences = [
  {
    id: '1',
    name: 'Museo Nacional de Bellas Artes',
    type: 'Museo',
    latitude: -34.5856,
    longitude: -58.3934,
    description: 'El Museo Nacional de Bellas Artes es el museo de arte más importante de Argentina. Posee la colección de arte argentino más grande del mundo.',
    image: '🏛️',
    details: 'Fundado en 1895, contiene más de 12.000 piezas de arte, incluyendo pinturas, esculturas y grabados. Destacan obras de Van Gogh, Gauguin, Monet y artistas argentinos como Cándido López y Xul Solar. Entrada gratuita. Horario: Martes a Viernes de 11:00 a 20:00, Sábados y Domingos de 10:00 a 20:00.',
    address: 'Av. del Libertador 1473, Buenos Aires',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Teatro Colón',
    type: 'Teatro',
    latitude: -34.6010,
    longitude: -58.3830,
    description: 'El Teatro Colón es considerado uno de los mejores teatros líricos del mundo por su acústica y trayectoria artística.',
    image: '🎭',
    details: 'Inaugurado en 1908, este teatro de ópera es famoso por su acústica excepcional. Con capacidad para 2.500 espectadores, ha recibido a los más grandes artistas del mundo. Ofrece visitas guiadas diarias. Horario de visitas: Todos los días de 9:00 a 17:00.',
    address: 'Cerrito 628, Buenos Aires',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Jardín Japonés',
    type: 'Parque',
    latitude: -34.5766,
    longitude: -58.4105,
    description: 'El Jardín Japonés es un tradicional jardín japonés situado en el barrio de Palermo. Es el más grande de su tipo fuera de Japón.',
    image: '🌸',
    details: 'Creado en 1967, el jardín cuenta con un lago, puentes rojos, linternas de piedra y una casa de té. Ideal para relajarse y disfrutar de la naturaleza en medio de la ciudad. Horario: Todos los días de 10:00 a 18:45. Entrada general: $1200.',
    address: 'Av. Casares 3401, Buenos Aires',
    rating: 4.7
  },
  {
    id: '4',
    name: 'La Boca - Caminito',
    type: 'Atracción',
    latitude: -34.6392,
    longitude: -58.3601,
    description: 'Caminito es una calle museo y un pasaje tradicional de gran valor cultural. Se caracteriza por sus casas coloridas y su ambiente tanguero.',
    image: '🎨',
    details: 'Fue fuente de inspiración para la música "Caminito", compuesta en 1926. Sus coloridas casas de chapa reflejan la influencia de los inmigrantes italianos. Artistas callejeros, bailarines de tango y restaurantes típicos adornan este paseo al aire libre.',
    address: 'Caminito, La Boca, Buenos Aires',
    rating: 4.5
  },
  {
    id: '5',
    name: 'Reserva Ecológica Costanera Sur',
    type: 'Naturaleza',
    latitude: -34.6071,
    longitude: -58.3500,
    description: 'La Reserva Ecológica es un área natural protegida de 350 hectáreas ubicada junto al centro financiero de Buenos Aires.',
    image: '🌿',
    details: 'Creada sobre terrenos ganados al Río de la Plata, esta reserva alberga una gran diversidad de flora y fauna, incluyendo más de 200 especies de aves. Cuenta con senderos para caminatas, ciclismo y observación de aves. Horario: Martes a Domingo de 8:00 a 18:00.',
    address: 'Av. Tristán Achával Rodríguez 1550, Buenos Aires',
    rating: 4.6
  },
  {
    id: '6',
    name: 'MALBA',
    type: 'Museo',
    latitude: -34.5764,
    longitude: -58.4039,
    description: 'El Museo de Arte Latinoamericano de Buenos Aires (MALBA) alberga una de las colecciones más importantes de arte latinoamericano del siglo XX.',
    image: '🖼️',
    details: 'Fundado en 2001, el museo exhibe obras de artistas como Frida Kahlo, Diego Rivera, Tarsila do Amaral y Antonio Berni. El edificio, de arquitectura contemporánea, es una obra de arte en sí mismo. Horario: Jueves a Lunes de 12:00 a 20:00, Miércoles de 12:00 a 21:00. Cerrado los martes.',
    address: 'Av. Figueroa Alcorta 3415, Buenos Aires',
    rating: 4.7
  }
];

const NearbyExperiencesScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState([]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        // Solicita permisos de ubicación
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            
            // Añadir distancias a las experiencias
            const experiencesWithDistance = mockExperiences.map(exp => {
              const distance = calculateDistance(
                latitude, longitude,
                exp.latitude, exp.longitude
              );
              return { ...exp, distance };
            });
            
            // Ordenar por distancia
            const sortedExperiences = experiencesWithDistance.sort(
              (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
            );
            
            setExperiences(sortedExperiences);
            setLoading(false);
          },
          error => {
            console.log(error);
            Alert.alert(
              'Error de ubicación',
              'No pudimos obtener tu ubicación. Por favor, activa los permisos de localización.',
              [{ text: 'OK' }]
            );
            // Mostrar experiencias sin distancia
            setExperiences(mockExperiences);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        console.warn(err);
      }
    };
    
    requestLocationPermission();
  }, []);

  const toggleExperienceSelection = (experience) => {
    const isSelected = selectedExperiences.some(exp => exp.id === experience.id);
    
    if (isSelected) {
      setSelectedExperiences(
        selectedExperiences.filter(exp => exp.id !== experience.id)
      );
    } else {
      setSelectedExperiences([...selectedExperiences, experience]);
    }
  };

  const showExperienceDetails = (experience) => {
    setSelectedExperience(experience);
    setModalVisible(true);
  };

  const viewSelectedExperiences = () => {
    navigation.navigate('SelectedExperiences', {
      selectedExperiences: selectedExperiences
    });
  };

  const renderExperienceItem = ({ item }) => {
    const isSelected = selectedExperiences.some(exp => exp.id === item.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.experienceCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => toggleExperienceSelection(item)}
      >
        <View style={styles.experienceImage}>
          <Text style={styles.experienceImageText}>{item.image}</Text>
        </View>
        <View style={styles.experienceContent}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => showExperienceDetails(item)}
            >
              <Text style={styles.infoButtonText}>ℹ️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.experienceType}>{item.type}</Text>
          <Text style={styles.experienceDescription} numberOfLines={2}>
            {item.description}
          </Text>
          {item.distance && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>📍 {item.distance} km</Text>
            </View>
          )}
        </View>
        <View style={styles.selectIndicator}>
          {isSelected && <Text style={styles.selectIndicatorText}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary.main} />
        <Text style={styles.loadingText}>Buscando experiencias cercanas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Experiencias Cercanas</Text>
      </View>
      
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          Experiencias seleccionadas: {selectedExperiences.length}
        </Text>
      </View>

      <FlatList
        data={experiences}
        keyExtractor={(item) => item.id}
        renderItem={renderExperienceItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedExperiences.length > 0 && (
        <View style={styles.footer}>
          <CustomButton
            title={`Ver ${selectedExperiences.length} experiencias seleccionadas`}
            onPress={viewSelectedExperiences}
            style={styles.viewSelectedButton}
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
                    title={selectedExperiences.some(exp => exp.id === selectedExperience.id) 
                      ? "Quitar de selección" 
                      : "Añadir a selección"}
                    onPress={() => {
                      toggleExperienceSelection(selectedExperience);
                      setModalVisible(false);
                    }}
                    style={
                      selectedExperiences.some(exp => exp.id === selectedExperience.id)
                        ? styles.removeButton
                        : styles.addButton
                    }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background.default,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: palette.text.primary,
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
  counterContainer: {
    padding: 15,
    backgroundColor: palette.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  counterText: {
    fontSize: 14,
    color: palette.text.primary,
    fontWeight: '500',
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  experienceCard: {
    flexDirection: 'row',
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
    position: 'relative',
  },
  selectedCard: {
    borderColor: palette.primary.main,
    borderWidth: 2,
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
  },
  experienceImage: {
    width: 80,
    height: 'auto',
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceImageText: {
    fontSize: 36,
  },
  experienceContent: {
    flex: 1,
    padding: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  experienceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    flex: 1,
    marginRight: 10,
  },
  infoButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  infoButtonText: {
    fontSize: 18,
  },
  experienceType: {
    fontSize: 12,
    color: palette.text.secondary,
    marginTop: 2,
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 14,
    color: palette.text.primary,
    lineHeight: 20,
  },
  distanceContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  distanceText: {
    fontSize: 14,
    color: palette.primary.main,
    fontWeight: '500',
  },
  selectIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  selectIndicatorText: {
    color: palette.secondary.main,
    fontWeight: 'bold',
    fontSize: 14,
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
  viewSelectedButton: {
    backgroundColor: palette.primary.main,
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
  addButton: {
    backgroundColor: palette.primary.main,
  },
  removeButton: {
    backgroundColor: '#FF5252',
  },
});

export default NearbyExperiencesScreen;
