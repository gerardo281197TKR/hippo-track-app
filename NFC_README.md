# NFC Implementation Guide

## Configuración de NFC (Implementación Real)

### Dependencias Instaladas
- `react-native-nfc-manager`: Librería principal para NFC
- `@react-native-community/netinfo`: Verificación de conexión a internet
- `babel-plugin-module-resolver`: Para manejar stubs en modo Expo

### Implementación de Tags Reales

La aplicación ahora lee **tags NFC reales** en lugar de simularlos:

- **Lectura Real**: Escaneo de tags NFC físicos
- **Datos Reales**: ID, tecnologías y datos NDEF reales
- **Discord Integration**: Envío de datos reales al webhook
- **Logs Detallados**: Información completa de cada tag leído

### Permisos Configurados

#### Android
- `android.permission.NFC` en `app.json`

#### iOS
- `NFCReaderUsageDescription` en `infoPlist`

### Funcionalidades Implementadas

#### 1. Verificación de Soporte NFC
```javascript
const isSupported = await NfcManager.isSupported();
const isEnabled = await NfcManager.isEnabled();
```

#### 2. Verificación de Conexión a Internet
```javascript
const state = await NetInfo.fetch();
const isConnected = state.isConnected;
```

#### 3. Escaneo de Tags NFC Reales
```javascript
await NfcManager.start();
await NfcManager.requestTechnology(NfcTech.Ndef);
const subscription = NfcManager.addListener('onTagDiscovered', (tag) => {
  processNFCTag(tag); // Tag real detectado
});
```

#### 4. Procesamiento de Tags Reales
- Lectura del ID real del tag
- Identificación de tecnologías reales soportadas
- Lectura de datos NDEF reales
- Registro de timestamp
- Logs detallados en consola

## Verificación de Conexión

### Funcionalidades
- **Verificación Inicial**: Al cargar la pantalla
- **Monitoreo Continuo**: Escucha cambios de conexión en tiempo real
- **Notificación Automática**: Alerta cuando se pierde conexión
- **Redirección**: Envía al login cuando no hay conexión
- **Validación**: Previene escaneo NFC sin conexión

### Logs en Consola

#### Verificación Inicial
```
Verificación inicial de conexión: Conectado
Estado de conexión: Conectado
```

#### Cambios de Conexión
```
Estado de conexión: Desconectado
No hay conexión a internet - Redirigiendo al logout
Usuario confirmó - Redirigiendo al login
```

#### Durante el Escaneo
```
Sin conexión - No se puede procesar el tag
```

## Logs en Consola

### Verificación Inicial
```
NFC Support Check: NFC is supported
NFC Enabled Check: NFC is enabled
Verificación inicial de conexión: Conectado
```

### Durante el Escaneo
```
Iniciando escaneo NFC...
Sesión NFC iniciada
Tecnología NFC solicitada
Tag NFC detectado: { id: "...", techTypes: [...] }
```

### Procesamiento
```
Procesando tag NFC...
Información del tag procesada:
- ID: ...
- Tecnologías: [...]
Conectado al tag NFC
Datos NDEF: {...}
Conexión cerrada
Asistencia registrada exitosamente: {
  tagId: "...",
  timestamp: "...",
  techTypes: [...]
}
```

### Errores
```
Error checking NFC support: ...
Error al iniciar sesión NFC: ...
Error procesando tag NFC: ...
Error verificando conexión: ...
```

## Estados de la Aplicación

### Con Conexión
- ✅ NFC habilitado
- ✅ Conectado a internet
- ✅ Conectado al servidor
- ✅ Escaneo NFC disponible

### Sin Conexión
- ❌ Sin conexión a internet
- ❌ Sin conexión al servidor
- ❌ Escaneo NFC deshabilitado
- ⚠️ Redirección automática al login

## Uso en Dispositivos

### Dispositivos Soportados
- **Android**: Dispositivos con NFC habilitado
- **iOS**: iPhone 7 y posteriores con iOS 11+

### Instrucciones de Uso
1. Abrir la aplicación
2. Verificar que NFC esté habilitado
3. Verificar conexión a internet
4. Presionar "Escanear NFC"
5. Acercar el dispositivo al tag NFC
6. Esperar la confirmación de lectura

### Timeout
- El escaneo se cancela automáticamente después de 30 segundos
- Se puede cancelar manualmente cerrando la sesión

## Flujo de Verificación

### Al Cargar la Pantalla
1. Verificar soporte NFC
2. Verificar conexión inicial
3. Suscribirse a cambios de conexión

### Al Cambiar Conexión
1. Detectar cambio de estado
2. Mostrar notificación
3. Redirigir al login si no hay conexión

### Al Escanear NFC
1. Verificar conexión antes de escanear
2. Verificar soporte NFC
3. Iniciar sesión NFC
4. Solicitar tecnología NDEF
5. Procesar tag si hay conexión

## Configuración de Babel

### Stubs para Modo Expo
```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  
  const isExpo = process.env.EXPO_PUBLIC_MODE === 'expo' || !process.env.EXPO_PUBLIC_MODE;
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'react-native-nfc-manager': isExpo 
              ? './stubs/NfcManagerStub.js'
              : 'react-native-nfc-manager',
          },
        },
      ],
    ],
  };
};
```

### Stub Implementation
El stub simula la funcionalidad de NFC en modo Expo:
- Verificación de soporte
- Escaneo simulado
- Generación de IDs únicos
- Logs detallados

## Modos de Desarrollo

### Modo Expo (Desarrollo)
- Usa stubs para simular NFC
- Permite desarrollo sin configuración nativa
- Logs indican que es simulación
- Funciona en Expo Go

### Modo Nativo (Producción)
- Usa librería real de NFC
- Requiere configuración nativa
- Funciona con tags NFC reales
- Requiere build nativo

## Próximos Pasos

### Mejoras Sugeridas
1. **Persistencia de Datos**: Guardar historial de lecturas
2. **Validación de Tags**: Verificar tags específicos del sistema
3. **Sincronización**: Enviar datos al servidor
4. **Notificaciones**: Alertas push de asistencia registrada
5. **Modo Offline**: Funcionamiento sin conexión
6. **Reconexión Automática**: Reintentar cuando se recupere conexión
7. **Lectura NDEF Avanzada**: Leer y escribir datos en tags

### Integración con Backend
```javascript
// Ejemplo de envío al servidor
const sendAttendanceToServer = async (tagData) => {
  try {
    const response = await fetch('API_URL/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tagId: tagData.id,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        ndefData: tagData.ndef,
        techTypes: tagData.techTypes,
      }),
    });
    console.log('Datos enviados al servidor:', response);
  } catch (error) {
    console.error('Error enviando datos:', error);
  }
};
```

## Troubleshooting

### Problemas Comunes
1. **NFC no detectado**: Verificar que el dispositivo soporte NFC
2. **Permisos denegados**: Revisar configuración de permisos
3. **Tags no leídos**: Asegurar que el tag esté en buen estado
4. **Timeout frecuente**: Verificar distancia y posición del tag
5. **Sin conexión**: Verificar conexión a internet
6. **Redirección no deseada**: Verificar estado de red
7. **Error de stub**: Verificar configuración de Babel

### Debug
- Todos los eventos se registran en la consola
- Usar `console.log` para debugging adicional
- Verificar logs de Expo para errores del sistema
- Monitorear estado de conexión en tiempo real
- Verificar que la librería NFC esté instalada correctamente
- Comprobar configuración de permisos en `app.json`

## Referencias

- [featherbear/expo-nfc-react-native](https://github.com/featherbear/expo-nfc-react-native) - Repositorio base
- [react-native-nfc-manager](https://github.com/revtel/react-native-nfc-manager) - Librería principal
- [Expo NFC Documentation](https://docs.expo.dev/versions/latest/sdk/nfc/) - Documentación oficial 