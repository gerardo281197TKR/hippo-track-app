#!/usr/bin/env node

/**
 * Script para compilar la aplicación en modo producción
 * Con NFC real habilitado
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando compilación de producción...');

// Verificar que estamos en el directorio correcto
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: No se encontró package.json. Asegúrate de estar en el directorio correcto.');
  process.exit(1);
}

// Verificar que react-native-nfc-manager esté instalado
const nodeModulesPath = path.join(__dirname, '..', 'node_modules', 'react-native-nfc-manager');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ Error: react-native-nfc-manager no está instalado.');
  console.log('💡 Ejecuta: npm install react-native-nfc-manager');
  process.exit(1);
}

console.log('✅ Dependencias verificadas');

// Configurar variables de entorno para producción
process.env.EXPO_PUBLIC_MODE = 'production';
process.env.NODE_ENV = 'production';

console.log('🔧 Configurando modo producción...');

try {
  // Limpiar cache
  console.log('🧹 Limpiando cache...');
  execSync('npx expo start --clear', { stdio: 'inherit' });
  
  console.log('\n📱 Opciones de compilación:');
  console.log('1. Para Android: npm run build:android');
  console.log('2. Para iOS: npm run build:ios');
  console.log('3. Para desarrollo: npm run start:native');
  
  console.log('\n🎯 Para compilar APK de producción:');
  console.log('npx expo run:android --variant release');
  
  console.log('\n🎯 Para compilar IPA de producción:');
  console.log('npx expo run:ios --configuration Release');
  
  console.log('\n✨ Configuración de producción completada!');
  console.log('\n📋 Notas importantes:');
  console.log('- La aplicación requiere un dispositivo con NFC');
  console.log('- NFC debe estar habilitado en el dispositivo');
  console.log('- Los tags NFC deben ser compatibles con NDEF');
  console.log('- La aplicación enviará datos reales a Discord');
  
} catch (error) {
  console.error('❌ Error durante la configuración:', error.message);
  process.exit(1);
} 