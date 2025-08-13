// Servicio para manejar las APIs de la aplicación
import API_CONFIG, { getApiUrl, getAuthHeaders } from '../config/apiConfig';

class ApiService {
  // Función para hacer login (por ahora no valida nada)
  static async login(email, password) {
    try {
      console.log('API Service: Intentando login con:', { email, password });
      
      // Simulación de llamada a API de login
      // Por ahora no valida nada, solo simula una respuesta exitosa
      
      /*const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });*/

      // Como no hay API real, simulamos una respuesta exitosa
      console.log('API Service: Login exitoso (simulado)');
      
      return {
        success: true,
        data: {
          user: {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            email: email,
            name: 'Usuario Demo',
            role: 'employee'
          },
          token: 'demo_token_' + Math.random().toString(36).substr(2, 20)
        },
        message: 'Login exitoso'
      };

    } catch (error) {
      console.error('API Service: Error en login:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error en el login'
      };
    }
  }

  // Función para enviar datos NFC al webhook de Discord
  static async sendNFCDataToDiscord(nfcData) {
    try {
      console.log('API Service: Enviando datos NFC real a Discord:', nfcData);
      
      const discordPayload = {
        username: API_CONFIG.DISCORD.BOT_NAME,
        avatar_url: API_CONFIG.DISCORD.BOT_AVATAR,
        embeds: [
          {
            title: '🎯 Asistencia Registrada (Tag Real)',
            description: 'Se ha registrado una nueva asistencia mediante NFC con tag real',
            color: API_CONFIG.DISCORD.EMBED_COLORS.SUCCESS,
            fields: [
              {
                name: '📱 ID del Tag',
                value: nfcData.tagId || 'No disponible',
                inline: true
              },
              {
                name: '⏰ Fecha y Hora',
                value: nfcData.timestamp ? new Date(nfcData.timestamp).toLocaleString('es-ES') : 'No disponible',
                inline: true
              },
              {
                name: '🔧 Tecnologías',
                value: nfcData.techTypes ? nfcData.techTypes.join(', ') : 'No disponible',
                inline: true
              },
              {
                name: '👤 Usuario',
                value: nfcData.userEmail || 'No disponible',
                inline: true
              },
              {
                name: '📍 Ubicación',
                value: nfcData.location || 'No disponible',
                inline: true
              },
              {
                name: '📊 Estado',
                value: nfcData.isRealTag ? '✅ Tag Real Leído' : '✅ Registrado exitosamente',
                inline: true
              }
            ],
            footer: {
              text: 'Sistema de Asistencia NFC • Tag Real • ' + new Date().toLocaleDateString('es-ES')
            },
            timestamp: new Date().toISOString()
          }
        ]
      };

      const response = await fetch(API_CONFIG.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(discordPayload),
      });

      if (response.ok) {
        console.log('API Service: Datos NFC real enviados exitosamente a Discord');
        return {
          success: true,
          message: 'Datos de tag real enviados a Discord exitosamente'
        };
      } else {
        console.error('API Service: Error al enviar a Discord:', response.status, response.statusText);
        return {
          success: false,
          error: `Error ${response.status}: ${response.statusText}`,
          message: 'Error al enviar datos a Discord'
        };
      }

    } catch (error) {
      console.error('API Service: Error enviando datos NFC real a Discord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error de conexión al enviar datos'
      };
    }
  }

  // Función para enviar datos NFC a la API principal (para futuras implementaciones)
  static async sendNFCDataToAPI(nfcData) {
    try {
      console.log('API Service: Enviando datos NFC a API principal:', nfcData);
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER_ATTENDANCE), {
        method: 'POST',
        headers: getAuthHeaders(nfcData.token || global.authToken),
        body: JSON.stringify({
          tagId: nfcData.tagId,
          timestamp: nfcData.timestamp,
          techTypes: nfcData.techTypes,
          userId: nfcData.userId,
          userEmail: nfcData.userEmail,
          location: nfcData.location || 'Ubicación no disponible',
          deviceInfo: nfcData.deviceInfo || 'Dispositivo no disponible',
          ndefData: nfcData.ndefData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Service: Datos NFC enviados exitosamente a API principal');
        return {
          success: true,
          data: data,
          message: 'Asistencia registrada exitosamente'
        };
      } else {
        console.error('API Service: Error al enviar a API principal:', response.status);
        return {
          success: false,
          error: `Error ${response.status}`,
          message: 'Error al registrar asistencia'
        };
      }

    } catch (error) {
      console.error('API Service: Error enviando datos NFC a API principal:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error de conexión'
      };
    }
  }

  // Función para obtener información del dispositivo
  static getDeviceInfo() {
    return {
      platform: 'React Native',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      userAgent: 'NFC Attendance App',
      appVersion: '1.0.0'
    };
  }

  // Función para validar conexión a internet
  static async checkInternetConnection() {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error('API Service: Error verificando conexión:', error);
      return false;
    }
  }
}

export default ApiService; 