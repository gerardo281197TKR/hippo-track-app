#!/usr/bin/env node

/**
 * Script para configurar el modo nativo de la aplicación
 * Basado en featherbear/expo-nfc-react-native
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando modo nativo para NFC...');

// Verificar si estamos en modo nativo
const isNative = process.env.EXPO_PUBLIC_MODE === 'native';

if (isNative) {
  console.log('✅ Modo nativo detectado - Usando react-native-nfc-manager real');
} else {
  console.log('📱 Modo Expo detectado - Usando stubs de NFC');
}

// Crear archivo de configuración temporal
const configPath = path.join(__dirname, '..', '.expo', 'nfc-config.json');
const configDir = path.dirname(configPath);

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

const config = {
  mode: isNative ? 'native' : 'expo',
  timestamp: new Date().toISOString(),
  nfcEnabled: true,
  stubPath: './stubs/NfcManagerStub.js',
  realLibrary: 'react-native-nfc-manager'
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('📝 Configuración guardada en:', configPath);
console.log('🎯 Modo actual:', config.mode);

if (isNative) {
  console.log('\n📋 Para compilar en modo nativo:');
  console.log('1. npx expo run:android');
  console.log('2. npx expo run:ios');
} else {
  console.log('\n📋 Para desarrollo en modo Expo:');
  console.log('1. npx expo start');
  console.log('2. Usar Expo Go en tu dispositivo');
}

console.log('\n✨ Configuración completada!'); 