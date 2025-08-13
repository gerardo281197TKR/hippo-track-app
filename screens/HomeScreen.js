import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import ApiService from '../services/apiService';

// Detectar si estamos en un entorno que soporta NFC real
const isNativePlatform = Platform.OS === 'android' || Platform.OS === 'ios';
const isExpoGo = !isNativePlatform || (typeof document !== 'undefined' && document.location?.href?.includes('expo'));

const HomeScreen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastAttendance, setLastAttendance] = useState(null);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isSendingData, setIsSendingData] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    checkNFCSupport();
    checkInternetConnection();
    
    // Suscribirse a cambios de conexión
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Estado de conexión:', state.isConnected ? 'Conectado' : 'Desconectado');
      setIsConnected(state.isConnected);
      
      if (!state.isConnected) {
        handleNoInternetConnection();
      }
    });

    return () => {
      unsubscribe();
      // Limpiar NFC al desmontar
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  const checkInternetConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      console.log('Verificación inicial de conexión:', state.isConnected ? 'Conectado' : 'Desconectado');
      setIsConnected(state.isConnected);
      
      if (!state.isConnected) {
        handleNoInternetConnection();
      }
    } catch (error) {
      console.error('Error verificando conexión:', error);
      setIsConnected(false);
      handleNoInternetConnection();
    }
  };

  const handleNoInternetConnection = () => {
    console.log('No hay conexión a internet - Redirigiendo al logout');
    Alert.alert(
      'Sin Conexión a Internet',
      'El sistema necesita conexión a internet para funcionar correctamente. Serás redirigido al login.',
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('Usuario confirmó - Redirigiendo al login');
            navigation.replace('Login');
          }
        }
      ],
      { cancelable: false }
    );
  };

  const checkNFCSupport = async () => {
    try {
      console.log('Verificando soporte NFC real...');
      console.log('Plataforma:', Platform.OS);
      console.log('Es nativo:', isNativePlatform);
      console.log('Es Expo Go:', isExpoGo);
      
      // Si estamos en Expo Go o web, NFC no funcionará
      if (isExpoGo) {
        console.log('NFC no disponible en Expo Go/Web');
        setNfcSupported(false);
        Alert.alert(
          'NFC No Disponible',
          'NFC solo funciona en dispositivos nativos (Android/iOS).\n\nPara usar NFC real, compila la aplicación nativamente:\n\nnpm run build:android\nnpm run build:ios',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const isSupported = await NfcManager.isSupported();
      console.log('NFC Support Check:', isSupported ? 'NFC is supported' : 'NFC is not supported');
      setNfcSupported(isSupported);
      
      if (isSupported) {
        const isEnabled = await NfcManager.isEnabled();
        console.log('NFC Enabled Check:', isEnabled ? 'NFC is enabled' : 'NFC is disabled');
        
        if (!isEnabled) {
          Alert.alert(
            'NFC Deshabilitado',
            'Por favor habilita NFC en la configuración de tu dispositivo para usar esta aplicación.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'NFC No Soportado',
          'Tu dispositivo no soporta NFC. Esta aplicación requiere un dispositivo con NFC para funcionar.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error checking NFC support:', error);
      setNfcSupported(false);
      Alert.alert(
        'Error NFC',
        'Error al verificar el soporte de NFC. Asegúrate de que tu dispositivo tenga NFC habilitado.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNFCScan = async () => {
    // Verificar conexión antes de escanear
    if (!isConnected) {
      Alert.alert(
        'Sin Conexión',
        'No hay conexión a internet. El sistema necesita conexión para registrar asistencia.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Verificar si estamos en un entorno que soporta NFC
    if (isExpoGo) {
      Alert.alert(
        'NFC No Disponible',
        'NFC solo funciona en dispositivos nativos (Android/iOS).\n\nPara usar NFC real, compila la aplicación nativamente:\n\nnpm run build:android\nnpm run build:ios',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!nfcSupported) {
      Alert.alert(
        'NFC No Soportado',
        'Tu dispositivo no soporta NFC o NFC no está habilitado.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsScanning(true);
    console.log('Iniciando escaneo NFC real...');

    try {
      // Iniciar sesión NFC
      await NfcManager.start();
      console.log('Sesión NFC iniciada correctamente');

      // Registrar listener para tags descubiertos
      const subscription = NfcManager.addListener('onTagDiscovered', (tag) => {
        console.log('Tag NFC real detectado:', tag);
        processNFCTag(tag);
      });

      // Solicitar tecnología NFC
      await NfcManager.requestTechnology(NfcTech.Ndef);
      console.log('Tecnología NFC NDEF solicitada correctamente');

      // Mostrar mensaje al usuario
      Alert.alert(
        'Escaneando NFC',
        'Acerca tu dispositivo al tag NFC para registrar asistencia.\n\nMantén el dispositivo cerca del tag hasta que se complete la lectura.',
        [{ 
          text: 'Cancelar', 
          onPress: () => {
            console.log('Escaneo NFC cancelado por el usuario');
            NfcManager.cancelTechnologyRequest();
            setIsScanning(false);
            subscription?.remove();
          }
        }],
        { cancelable: false }
      );

      // Timeout después de 30 segundos
      setTimeout(() => {
        if (isScanning) {
          console.log('Timeout del escaneo NFC - No se detectó ningún tag');
          NfcManager.cancelTechnologyRequest();
          setIsScanning(false);
          subscription?.remove();
          Alert.alert(
            'Timeout',
            'No se detectó ningún tag NFC en 30 segundos.\n\nAsegúrate de que el tag esté cerca del dispositivo y que NFC esté habilitado.',
            [{ text: 'OK' }]
          );
        }
      }, 30000);

    } catch (error) {
      console.error('Error al iniciar sesión NFC:', error);
      setIsScanning(false);
      Alert.alert(
        'Error NFC',
        `Error al iniciar el escaneo NFC: ${error.message}\n\nAsegúrate de que NFC esté habilitado en tu dispositivo.`,
        [{ text: 'OK' }]
      );
    }
  };

  const processNFCTag = async (tag) => {
    try {
      console.log('Procesando tag NFC real...');
      
      // Verificar conexión antes de procesar
      if (!isConnected) {
        console.log('Sin conexión - No se puede procesar el tag');
        Alert.alert(
          'Sin Conexión',
          'No hay conexión a internet. No se puede registrar la asistencia.',
          [{ text: 'OK' }]
        );
        NfcManager.cancelTechnologyRequest();
        setIsScanning(false);
        return;
      }
      
      // Extraer información del tag real
      const tagId = tag.id || 'Unknown';
      const techTypes = tag.techTypes || [];
      
      console.log('Información del tag real:');
      console.log('- ID:', tagId);
      console.log('- Tecnologías:', techTypes);
      console.log('- Tag completo:', tag);
      
      // Intentar leer datos NDEF si está disponible
      let ndefData = null;
      try {
        await NfcManager.connect();
        console.log('Conectado al tag NFC real');
        
        // Leer datos NDEF
        const ndef = await NfcManager.getTag();
        console.log('Datos NDEF del tag real:', ndef);
        ndefData = ndef;
        
        await NfcManager.closeConnection();
        console.log('Conexión cerrada');
      } catch (ndefError) {
        console.log('No se pudieron leer datos NDEF del tag real:', ndefError.message);
      }
      
      // Preparar datos para enviar
      const now = new Date();
      const nfcData = {
        tagId: tagId,
        timestamp: now.toISOString(),
        techTypes: techTypes,
        ndefData: ndefData,
        userEmail: global.currentUser?.email || 'usuario@demo.com',
        userId: global.currentUser?.id || 'user_demo',
        deviceInfo: ApiService.getDeviceInfo(),
        location: 'Oficina Principal', // En una implementación real obtendrías la ubicación real
        isRealTag: true // Indicar que es un tag real
      };
      
      // Enviar datos a Discord
      await sendNFCDataToDiscord(nfcData);
      
      // Actualizar estado local
      setLastAttendance(now);
      
      console.log('Asistencia registrada exitosamente con tag real:', nfcData);

      // Cerrar sesión NFC
      NfcManager.cancelTechnologyRequest();
      setIsScanning(false);

    } catch (error) {
      console.error('Error procesando tag NFC real:', error);
      Alert.alert(
        'Error',
        `Error procesando el tag NFC: ${error.message}`,
        [{ text: 'OK' }]
      );
      NfcManager.cancelTechnologyRequest();
      setIsScanning(false);
    }
  };

  const sendNFCDataToDiscord = async (nfcData) => {
    setIsSendingData(true);
    console.log('HomeScreen: Enviando datos NFC a Discord...');

    try {
      const result = await ApiService.sendNFCDataToDiscord(nfcData);
      
      if (result.success) {
        console.log('HomeScreen: Datos enviados exitosamente a Discord');
        Alert.alert(
          'Asistencia Registrada',
          `Tag NFC leído exitosamente!\nID: ${nfcData.tagId}\nHora: ${new Date(nfcData.timestamp).toLocaleTimeString()}\n\n✅ Enviado a Discord`,
          [{ text: 'OK' }]
        );
      } else {
        console.error('HomeScreen: Error enviando a Discord:', result.error);
        Alert.alert(
          'Asistencia Registrada',
          `Tag NFC leído exitosamente!\nID: ${nfcData.tagId}\nHora: ${new Date(nfcData.timestamp).toLocaleTimeString()}\n\n⚠️ Error enviando a Discord: ${result.message}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('HomeScreen: Error inesperado enviando a Discord:', error);
      Alert.alert(
        'Asistencia Registrada',
        `Tag NFC leído exitosamente!\nID: ${nfcData.tagId}\nHora: ${new Date(nfcData.timestamp).toLocaleTimeString()}\n\n⚠️ Error de conexión`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSendingData(false);
    }
  };

  const handleLogout = () => {
    if (isLoggingOut) {
      console.log('HomeScreen: Logout ya en progreso, ignorando clic');
      return;
    }

    try {
      console.log('HomeScreen: Iniciando proceso de logout...');
      setIsLoggingOut(true);
      
      // Limpiar NFC antes de hacer logout
      NfcManager.cancelTechnologyRequest();
      console.log('HomeScreen: NFC cancelado');
      
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          { 
            text: 'Cancelar', 
            style: 'cancel',
            onPress: () => {
              console.log('HomeScreen: Logout cancelado por el usuario');
              setIsLoggingOut(false);
            }
          },
          { 
            text: 'Cerrar Sesión', 
            style: 'destructive',
            onPress: () => {
              console.log('HomeScreen: Usuario confirmó logout - Limpiando datos y navegando');
              
              try {
                // Limpiar datos globales
                global.currentUser = null;
                global.authToken = null;
                console.log('HomeScreen: Datos globales limpiados');
                
                // Limpiar estados locales
                setLastAttendance(null);
                setIsScanning(false);
                setIsSendingData(false);
                console.log('HomeScreen: Estados locales limpiados');
                
                // Navegar al login
                navigation.replace('Login');
                console.log('HomeScreen: Navegación al login completada');
                
              } catch (error) {
                console.error('HomeScreen: Error durante el logout:', error);
                setIsLoggingOut(false);
                Alert.alert(
                  'Error',
                  'Error al cerrar sesión. Intenta de nuevo.',
                  [{ text: 'OK' }]
                );
              }
            }
          }
        ],
        { cancelable: false }
      );
      
    } catch (error) {
      console.error('HomeScreen: Error iniciando logout:', error);
      setIsLoggingOut(false);
      Alert.alert(
        'Error',
        'Error al iniciar el proceso de logout.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NFC Attendance</Text>
        <TouchableOpacity 
          style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]} 
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <View style={styles.logoutLoadingContainer}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={styles.logoutButtonText}>Cerrando...</Text>
            </View>
          ) : (
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>¡Bienvenido!</Text>
          <Text style={styles.welcomeSubtext}>
            Sistema de Control de Asistencia con NFC
          </Text>
          {global.currentUser && (
            <Text style={styles.userInfo}>
              Usuario: {global.currentUser.email}
            </Text>
          )}
        </View>

        {/* Connection Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Estado de Conexión</Text>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, isConnected ? styles.statusOnline : styles.statusOffline]} />
            <Text style={styles.statusText}>
              {isConnected ? 'Conectado a internet' : 'Sin conexión a internet'}
            </Text>
          </View>
        </View>

        {/* NFC Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Estado NFC</Text>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, nfcSupported ? styles.statusOnline : styles.statusOffline]} />
            <Text style={styles.statusText}>
              {nfcSupported ? 'NFC habilitado' : 'NFC no disponible'}
            </Text>
          </View>
        </View>

        {/* Main Action Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Registrar Asistencia</Text>
          <Text style={styles.cardDescription}>
            {!isConnected 
              ? 'Sin conexión a internet - El sistema necesita conexión'
              : nfcSupported 
                ? 'Acerca tu dispositivo al tag NFC para registrar tu entrada'
                : 'Tu dispositivo no soporta NFC'
            }
          </Text>
          
          <TouchableOpacity
            style={[
              styles.scanButton,
              (!nfcSupported || !isConnected || isScanning || isExpoGo) && styles.scanButtonDisabled
            ]}
            onPress={handleNFCScan}
            disabled={!nfcSupported || !isConnected || isScanning || isExpoGo}
          >
            {isScanning ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.scanButtonText}>
                {isExpoGo ? 'NFC No Disponible (Expo Go)' : 'Escanear NFC'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Last Attendance Card */}
        {lastAttendance && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Última Asistencia</Text>
            <Text style={styles.infoCardText}>
              {lastAttendance.toLocaleDateString()} - {lastAttendance.toLocaleTimeString()}
            </Text>
          </View>
        )}

        {/* System Status Card */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Estado del Sistema</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Conexión a Internet:</Text>
            <Text style={[styles.statusValue, { color: isConnected ? '#27ae60' : '#e74c3c' }]}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>NFC:</Text>
            <Text style={[styles.statusValue, { color: isExpoGo ? '#f39c12' : (nfcSupported ? '#27ae60' : '#e74c3c') }]}>
              {isExpoGo ? 'No Disponible (Expo Go)' : (nfcSupported ? 'Habilitado' : 'No Soportado')}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Plataforma:</Text>
            <Text style={[styles.statusValue, { color: isNativePlatform ? '#27ae60' : '#f39c12' }]}>
              {Platform.OS} {isNativePlatform ? '(Nativo)' : '(Expo Go)'}
            </Text>
          </View>
          {lastAttendance && (
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Última Asistencia:</Text>
              <Text style={styles.statusValue}>
                {lastAttendance.toLocaleString('es-ES')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
  },
  logoutButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  logoutLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  scanButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoCardText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusOnline: {
    backgroundColor: '#27ae60',
  },
  statusOffline: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statusContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 