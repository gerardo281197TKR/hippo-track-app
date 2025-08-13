# API Integration Guide

## Configuración de APIs

### Servicios Implementados

#### 1. **Login API** (Simulado)
- **Endpoint**: `POST /auth/login`
- **Función**: Autenticación de usuarios
- **Estado**: Simulado (no valida credenciales)
- **Respuesta**: Usuario demo con token

#### 2. **Discord Webhook**
- **URL**: `https://discord.com/api/webhooks/1405312636274348063/UyIqlWhIfRrR5kRrB7NP5nCalhECXMC5_c3XGwhZiK6vsqI_NNzjMF3P2jE46F0SLedL`
- **Función**: Envío de notificaciones de asistencia
- **Estado**: Funcional
- **Formato**: Embed de Discord con datos NFC

#### 3. **Attendance API** (Preparado)
- **Endpoint**: `POST /attendance/register`
- **Función**: Registro de asistencia en API principal
- **Estado**: Preparado para futura implementación

## Estructura de Archivos

```
services/
├── apiService.js          # Servicio principal de APIs
└── ...

config/
├── apiConfig.js           # Configuración centralizada
└── ...

screens/
├── LoginScreen.js         # Consume login API
├── HomeScreen.js          # Envía datos NFC a Discord
└── ...
```

## Login API

### Implementación Actual
```javascript
// Simulación de login (no valida credenciales)
const loginResult = await ApiService.login(email, password);

if (loginResult.success) {
  // Guardar datos del usuario
  global.currentUser = loginResult.data.user;
  global.authToken = loginResult.data.token;
  
  // Navegar a Home
  navigation.replace('Home');
}
```

### Logs en Consola
```
API Service: Intentando login con: { email: "...", password: "..." }
API Service: Login exitoso (simulado)
LoginScreen: Resultado del login: { success: true, data: {...} }
LoginScreen: Login exitoso, navegando a Home
```

### Para Implementar Login Real
1. Cambiar `API_CONFIG.BASE_URL` en `config/apiConfig.js`
2. Implementar validación de credenciales en el backend
3. Manejar tokens JWT reales
4. Implementar refresh tokens

## Discord Webhook

### Payload Enviado
```json
{
  "username": "NFC Attendance Bot",
  "avatar_url": "...",
  "embeds": [
    {
      "title": "🎯 Asistencia Registrada",
      "description": "Se ha registrado una nueva asistencia mediante NFC",
      "color": 0x27ae60,
      "fields": [
        {
          "name": "📱 ID del Tag",
          "value": "NFC_ABC123XYZ",
          "inline": true
        },
        {
          "name": "⏰ Fecha y Hora",
          "value": "15/1/2024, 10:30:00",
          "inline": true
        },
        {
          "name": "🔧 Tecnologías",
          "value": "NFC-A, NFC-B",
          "inline": true
        },
        {
          "name": "👤 Usuario",
          "value": "usuario@demo.com",
          "inline": true
        },
        {
          "name": "📍 Ubicación",
          "value": "Oficina Principal",
          "inline": true
        },
        {
          "name": "📊 Estado",
          "value": "✅ Registrado exitosamente",
          "inline": true
        }
      ],
      "footer": {
        "text": "Sistema de Asistencia NFC • 15/1/2024"
      },
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Logs en Consola
```
API Service: Enviando datos NFC a Discord: { tagId: "...", ... }
API Service: Datos NFC enviados exitosamente a Discord
HomeScreen: Datos enviados exitosamente a Discord
```

### Estados de Envío
- ✅ **Exitoso**: Datos enviados a Discord
- ⚠️ **Error de API**: Error HTTP del webhook
- ❌ **Error de Conexión**: Problema de red

## Attendance API (Futuro)

### Estructura Preparada
```javascript
// Envío a API principal (preparado para futuro)
const apiResult = await ApiService.sendNFCDataToAPI(nfcData);

if (apiResult.success) {
  // Datos guardados en base de datos
  console.log('Asistencia registrada en API principal');
} else {
  // Error en API principal
  console.error('Error en API principal:', apiResult.error);
}
```

### Datos Enviados
```json
{
  "tagId": "NFC_ABC123XYZ",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "techTypes": ["NFC-A", "NFC-B"],
  "userId": "user_abc123",
  "userEmail": "usuario@demo.com",
  "location": "Oficina Principal",
  "deviceInfo": {
    "platform": "React Native",
    "version": "1.0.0",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "userAgent": "NFC Attendance App"
  },
  "ndefData": {
    // Datos NDEF del tag (si están disponibles)
  }
}
```

## Configuración

### Archivo de Configuración
```javascript
// config/apiConfig.js
export const API_CONFIG = {
  BASE_URL: 'https://api.example.com',
  DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/...',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER_ATTENDANCE: '/attendance/register',
    // ...
  },
  // ...
};
```

### Variables de Entorno (Recomendado)
```bash
# .env
API_BASE_URL=https://tu-api.com
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
API_TIMEOUT=30000
```

## Manejo de Errores

### Tipos de Errores
1. **Error de Red**: Sin conexión a internet
2. **Error de API**: Respuesta HTTP de error
3. **Error de Validación**: Datos incorrectos
4. **Error de Timeout**: Tiempo de espera agotado

### Logs de Error
```
API Service: Error en login: Network request failed
API Service: Error al enviar a Discord: Error 429: Too Many Requests
API Service: Error enviando datos NFC a API principal: timeout
```

## Próximos Pasos

### Mejoras Sugeridas
1. **Implementar API Real**: Reemplazar simulación de login
2. **Persistencia de Tokens**: Usar AsyncStorage para tokens
3. **Refresh Tokens**: Implementar renovación automática
4. **Retry Logic**: Reintentar envíos fallidos
5. **Offline Queue**: Cola de datos para envío offline
6. **Validación de Datos**: Validar datos antes de enviar
7. **Rate Limiting**: Manejar límites de Discord webhook

### Integración con Backend
```javascript
// Ejemplo de implementación real
const realLogin = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const data = await response.json();
    return { success: true, data };
  } else {
    throw new Error('Credenciales inválidas');
  }
};
```

## Testing

### Probar Discord Webhook
1. Escanear tag NFC en la app
2. Verificar mensaje en Discord
3. Comprobar logs en consola

### Probar Login
1. Ingresar cualquier email/password
2. Verificar navegación a Home
3. Comprobar datos de usuario

### Probar Errores
1. Desconectar internet
2. Verificar manejo de errores
3. Comprobar mensajes de usuario 