module.exports = function(api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Configuración para react-native-nfc-manager
      [
        'module-resolver',
        {
          alias: {
            // Usar la librería real de NFC
            'react-native-nfc-manager': 'react-native-nfc-manager',
          },
        },
      ],
    ],
  };
}; 