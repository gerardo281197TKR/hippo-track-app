# NFC Attendance - Sistema de Asistencia con NFC

## 🚀 Aplicación de Producción con NFC Real

Esta aplicación lee **tags NFC reales** y envía los datos de asistencia al webhook de Discord.

## ✅ Características Implementadas

### 🔐 Autenticación
- Login simulado (listo para API real)
- Verificación de conexión a internet
- Logout con confirmación

### 📱 NFC Real
- Lectura de tags NFC físicos
- Verificación de soporte NFC
- Detección de tags NDEF
- Logs detallados de lectura

### 🌐 Integración API
- Envío de datos a Discord webhook
- Verificación de conexión
- Manejo de errores
- Datos estructurados

### 📊 Datos Enviados
- ID real del tag NFC
- Timestamp de lectura
- Tecnologías NFC detectadas
- Información del usuario
- Ubicación configurada

## 🛠️ Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar para Producción
```bash
npm run setup:production
```

### 3. Iniciar Desarrollo
```bash
# Para desarrollo local
npm run setup:development

# Para producción
npm run start:production

# Para desarrollo nativo
npm run start:native
```

## 📱 Compilación de Producción

### Android
```bash
# Desarrollo
npm run build:android

# Producción (APK)
npm run build:android:release
```

### iOS
```bash
# Desarrollo
npm run build:ios

# Producción (IPA)
npm run build:ios:release
```

## 🔧 Configuración de NFC

### Permisos Configurados
- **Android**: `android.permission.NFC`
- **iOS**: `NFCReaderUsageDescription`

### Tags Soportados
- Tags NDEF compatibles
- Tarjetas de acceso
- Stickers NFC
- Cualquier tag NFC estándar

## 📋 Uso de la Aplicación

### Pasos de Uso
1. **Abrir aplicación** en dispositivo con NFC
2. **Hacer login** (simulado)
3. **Verificar NFC** habilitado
4. **Presionar "Escanear NFC"**
5. **Acercar tag NFC** al dispositivo
6. **Esperar confirmación** de lectura
7. **Verificar Discord** - mensaje con datos reales

### Logs Esperados
```
Verificando soporte NFC real...
NFC Support Check: NFC is supported
NFC Enabled Check: NFC is enabled
Iniciando escaneo NFC real...
Sesión NFC iniciada correctamente
Tag NFC real detectado: { id: "real_tag_id", ... }
Procesando tag NFC real...
API Service: Enviando datos NFC real a Discord
```

## 🔍 Verificación de Funcionamiento

### En Discord
- **Título**: "🎯 Asistencia Registrada (Tag Real)"
- **Estado**: "✅ Tag Real Leído"
- **Datos**: ID real, tecnologías, timestamp, usuario

### En Consola
- Logs detallados de cada paso
- Información del tag leído
- Estado de envío a Discord

## ⚠️ Solución de Problemas

### NFC No Funciona
1. **Verificar hardware**: Dispositivo debe tener NFC
2. **Habilitar NFC**: Configuración > Conexiones > NFC
3. **Reiniciar dispositivo**: A veces necesario

### Tags No Leídos
1. **Verificar compatibilidad**: Tags NDEF
2. **Distancia correcta**: Cerca del dispositivo
3. **Posición correcta**: Buscar área NFC
4. **Tag en buen estado**: Sin daños

### Errores de Conexión
1. **Verificar internet**: Necesario para enviar datos
2. **Verificar Discord**: Webhook activo
3. **Reintentar**: Errores temporales

## 📊 Estructura del Proyecto

```
asistencia-nfc/
├── screens/
│   ├── LoginScreen.js      # Pantalla de login
│   └── HomeScreen.js       # Pantalla principal con NFC
├── navigation/
│   └── AppNavigator.js     # Navegación principal
├── services/
│   └── apiService.js       # Servicios de API
├── config/
│   └── apiConfig.js        # Configuración de API
├── scripts/
│   ├── build-production.js # Script de producción
│   └── development-setup.js # Script de desarrollo
└── app.config.js           # Configuración de Expo
```

## 🔒 Seguridad

### Datos Recopilados
- ID del tag NFC (no personal)
- Timestamp de lectura
- Tecnologías NFC detectadas
- Email del usuario

### Datos NO Recopilados
- Contenido personal del tag
- Ubicación GPS real
- Información del dispositivo
- Datos sensibles

## 🚀 Despliegue

### Para Producción
1. **Compilar APK/IPA** con scripts de producción
2. **Firmar aplicación** con certificados
3. **Subir a stores** o distribución interna
4. **Configurar webhook** de Discord

### Para Testing
1. **Compilar APK** de desarrollo
2. **Instalar en dispositivos** de prueba
3. **Verificar funcionamiento** con tags reales
4. **Monitorear logs** para debugging

## 📞 Soporte

### Contacto
- **Versión**: 1.0.0
- **Plataforma**: React Native + Expo
- **NFC**: Tags reales compatibles con NDEF

### Reportar Problemas
1. **Capturar logs** de la consola
2. **Describir problema** detalladamente
3. **Incluir información** del dispositivo
4. **Adjuntar screenshots** si es necesario

---

**Nota**: Esta es una aplicación de producción que lee tags NFC reales. Asegúrate de tener los permisos necesarios y cumplir con las regulaciones locales sobre el uso de NFC. 