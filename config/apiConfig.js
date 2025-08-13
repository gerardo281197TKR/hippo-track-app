// Configuración de APIs
export const API_CONFIG = {
  // URL base de tu API principal (cambiar cuando tengas una API real)
  BASE_URL: 'https://api.example.com',
  
  // Webhook de Discord para notificaciones
  DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1405312636274348063/UyIqlWhIfRrR5kRrB7NP5nCalhECXMC5_c3XGwhZiK6vsqI_NNzjMF3P2jE46F0SLedL',
  
  // Endpoints de la API
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER_ATTENDANCE: '/attendance/register',
    GET_ATTENDANCE_HISTORY: '/attendance/history',
    GET_USER_PROFILE: '/user/profile',
  },
  
  // Configuración de headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Timeouts
  TIMEOUTS: {
    REQUEST: 30000, // 30 segundos
    NFC_SCAN: 30000, // 30 segundos
  },
  
  // Configuración de Discord
  DISCORD: {
    BOT_NAME: 'NFC Attendance Bot',
    BOT_AVATAR: 'https://cdn.discordapp.com/attachments/123456789/123456789/nfc-icon.png',
    EMBED_COLORS: {
      SUCCESS: 0x27ae60, // Verde
      ERROR: 0xe74c3c,   // Rojo
      WARNING: 0xf39c12, // Naranja
      INFO: 0x3498db,    // Azul
    }
  }
};

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener headers con autenticación
export const getAuthHeaders = (token) => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`,
  };
};

export default API_CONFIG; 