#!/usr/bin/env node

/**
 * Script para configuración de desarrollo local
 * Para probar la aplicación con NFC real
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando entorno de desarrollo local...');

// Verificar que estamos en el directorio correcto
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: No se encontró package.json');
  process.exit(1);
}

console.log('✅ Directorio verificado');

try {
  // Limpiar cache
  console.log('🧹 Limpiando cache...');
  execSync('npx expo start --clear', { stdio: 'inherit' });
  
  console.log('\n🎯 Configuración completada!');
  console.log('\n📱 Para probar la aplicación:');
  console.log('1. Ejecutar: npm run start:production');
  console.log('2. Escanear QR con Expo Go en dispositivo con NFC');
  console.log('3. O usar: npm run start:native (para desarrollo nativo)');
  
  console.log('\n⚠️  Notas importantes:');
  console.log('- La aplicación requiere un dispositivo con NFC');
  console.log('- NFC debe estar habilitado en el dispositivo');
  console.log('- Los tags NFC deben ser compatibles con NDEF');
  console.log('- La aplicación enviará datos reales a Discord');
  
  console.log('\n🔍 Para verificar funcionamiento:');
  console.log('- Revisar logs en la consola');
  console.log('- Verificar mensajes en Discord');
  console.log('- Comprobar que se leen tags reales');
  
} catch (error) {
  console.error('❌ Error durante la configuración:', error.message);
  process.exit(1);
} 