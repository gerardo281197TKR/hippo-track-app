# NFC Attendance - Guía de Producción

## 🚀 Aplicación de Producción con NFC Real

Esta es la versión de producción de la aplicación NFC Attendance que lee **tags NFC reales** y envía los datos al webhook de Discord.

## 📋 Requisitos de Producción

### Dispositivos Soportados
- **Android**: Dispositivos con NFC habilitado (Android 4.4+)
- **iOS**: iPhone 7 y posteriores con iOS 11+

### Tags NFC Soportados
- Tags NDEF compatibles
- Tarjetas de acceso
- Stickers NFC
- Cualquier tag NFC estándar

## 🔧 Compilación de Producción

### 1. Preparar el Entorno
```bash
# Instalar dependencias
npm install

# Configurar para producción
npm run setup:production
```

### 2. Compilar para Android
```bash
# Desarrollo
npm run build:android

# Producción (APK)
npm run build:android:release
```

### 3. Compilar para iOS
```bash
# Desarrollo
npm run build:ios

# Producción (IPA)
npm run build:ios:release
```

## 📱 Instalación y Uso

### Pasos de Instalación
1. **Compilar la aplicación** usando los comandos anteriores
2. **Instalar en dispositivo** con NFC habilitado
3. **Habilitar NFC** en la configuración del dispositivo
4. **Conectar a internet** para envío de datos

### Uso de la Aplicación
1. **Abrir la aplicación**
2. **Hacer login** con cualquier credencial (simulado)
3. **Verificar NFC** - debe mostrar "NFC habilitado"
4. **Presionar "Escanear NFC"**
5. **Acercar tag NFC** al dispositivo
6. **Esperar confirmación** de lectura
7. **Verificar Discord** - mensaje con datos reales

## 🔍 Verificación de Funcionamiento

### Logs Esperados en Consola
```
Verificando soporte NFC real...
NFC Support Check: NFC is supported
NFC Enabled Check: NFC is enabled
Iniciando escaneo NFC real...
Sesión NFC iniciada correctamente
Tecnología NFC NDEF solicitada correctamente
Tag NFC real detectado: { id: "real_tag_id", techTypes: [...] }
Procesando tag NFC real...
Información del tag real:
- ID: real_tag_id
- Tecnologías: [NFC-A, NFC-B]
- Tag completo: {...}
Conectado al tag NFC real
Datos NDEF del tag real: {...}
API Service: Enviando datos NFC real a Discord: {...}
```

### Mensaje en Discord
- **Título**: "🎯 Asistencia Registrada (Tag Real)"
- **Estado**: "✅ Tag Real Leído"
- **Datos**: ID real, tecnologías, timestamp, usuario

## ⚠️ Solución de Problemas

### NFC No Detectado
1. **Verificar hardware**: Asegurar que el dispositivo tenga NFC
2. **Habilitar NFC**: Ir a Configuración > Conexiones > NFC
3. **Reiniciar dispositivo**: A veces necesario después de habilitar NFC

### Tags No Leídos
1. **Verificar compatibilidad**: Tags deben ser NDEF
2. **Distancia correcta**: Mantener tag cerca del dispositivo
3. **Posición correcta**: Buscar el área NFC del dispositivo
4. **Tag en buen estado**: Verificar que no esté dañado

### Errores de Conexión
1. **Verificar internet**: La app necesita conexión para enviar datos
2. **Verificar Discord**: El webhook debe estar activo
3. **Reintentar**: Los errores temporales se resuelven solos

### Errores de Compilación
1. **Limpiar cache**: `npm run clean`
2. **Reinstalar dependencias**: `rm -rf node_modules && npm install`
3. **Verificar Android Studio/Xcode**: Para compilación nativa

## 📊 Datos Enviados a Discord

### Estructura del Mensaje
```json
{
  "title": "🎯 Asistencia Registrada (Tag Real)",
  "fields": [
    {
      "name": "📱 ID del Tag",
      "value": "ID real del tag NFC"
    },
    {
      "name": "⏰ Fecha y Hora",
      "value": "Timestamp real de lectura"
    },
    {
      "name": "🔧 Tecnologías",
      "value": "Tecnologías NFC reales detectadas"
    },
    {
      "name": "👤 Usuario",
      "value": "Email del usuario logueado"
    },
    {
      "name": "📍 Ubicación",
      "value": "Ubicación configurada"
    },
    {
      "name": "📊 Estado",
      "value": "✅ Tag Real Leído"
    }
  ]
}
```

## 🔒 Seguridad y Privacidad

### Datos Recopilados
- ID del tag NFC (no contiene información personal)
- Timestamp de lectura
- Tecnologías NFC detectadas
- Email del usuario (del login)

### Datos NO Recopilados
- Contenido personal del tag
- Ubicación GPS real
- Información del dispositivo
- Datos sensibles

### Almacenamiento
- Los datos se envían directamente a Discord
- No se almacenan localmente
- No se comparten con terceros

## 🚀 Despliegue

### Para Producción
1. **Compilar APK/IPA** con `npm run build:android:release`
2. **Firmar la aplicación** con certificados de producción
3. **Subir a Google Play/App Store** o distribución interna
4. **Configurar webhook de Discord** en el servidor de producción

### Para Testing
1. **Compilar APK** con `npm run build:android`
2. **Instalar en dispositivos de prueba**
3. **Verificar funcionamiento** con tags reales
4. **Monitorear logs** para debugging

## 📞 Soporte

### Contacto
- **Desarrollador**: Sistema NFC Attendance
- **Versión**: 1.0.0
- **Plataforma**: React Native + Expo

### Reportar Problemas
1. **Capturar logs** de la consola
2. **Describir el problema** detalladamente
3. **Incluir información del dispositivo**
4. **Adjuntar screenshots** si es necesario

---

**Nota**: Esta es una aplicación de producción que lee tags NFC reales. Asegúrate de tener los permisos necesarios y cumplir con las regulaciones locales sobre el uso de NFC. 