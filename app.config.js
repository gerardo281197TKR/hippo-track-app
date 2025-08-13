export default {
  name: 'NFC Attendance',
  slug: 'hippo-track',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.nfcattendance.app',
    infoPlist: {
      NFCReaderUsageDescription: 'Esta aplicación necesita acceso a NFC para leer tags de asistencia',
      NSLocationWhenInUseUsageDescription: 'Esta aplicación necesita acceso a la ubicación para registrar asistencia'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.nfcattendance.app',
    permissions: [
      'android.permission.NFC',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION'
    ],
    intentFilters: [
      {
        action: 'android.nfc.action.TECH_DISCOVERED',
        category: ['android.intent.category.DEFAULT'],
        data: {
          mimeType: 'application/vnd.wfa.wsc'
        }
      },
      {
        action: 'android.nfc.action.TAG_DISCOVERED',
        category: ['android.intent.category.DEFAULT']
      }
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'react-native-nfc-manager'
  ],
  extra: {
    eas: {
      projectId: '416e7dfd-f520-4c26-9f2e-b5698f153131'
    }
  },
  owner: 'gerardo.luevanos01'
}; 