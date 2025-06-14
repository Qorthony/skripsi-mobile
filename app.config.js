const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

export default () => {
  let name = 'Skripsi';
  let androidPackage = 'com.qorthony.skripsi';
  let iosBundle = 'com.qorthony.skripsi';
  let scheme = 'skripsi';

  if (IS_DEV) {
    name = 'Skripsi (Dev)';
    androidPackage = 'com.qorthony.skripsi.dev';
    iosBundle = 'com.qorthony.skripsi.dev';
    scheme = 'skripsidev';
  } else if (IS_PREVIEW) {
    name = 'Skripsi (Preview)';
    androidPackage = 'com.qorthony.skripsi.preview';
    iosBundle = 'com.qorthony.skripsi.preview';
    scheme = 'skripsiprev';
  }
  
  return {
    name,
    slug: 'skripsi',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: iosBundle,
      supportsTablet: true,
      infoPlist: {
        NFCReaderUsageDescription: 'Aplikasi ini menggunakan NFC untuk membaca dan menulis tag tiket',
        'com.apple.developer.nfc.readersession.formats': ['NDEF'],
      },
    },
    android: {
      package: androidPackage,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: ['android.permission.NFC'],      
      intentFilters: [
        // Android App Links (HTTPS)
        {
          action: 'VIEW',
          autoVerify: true,
          data: {
            scheme:'https',
            host: 'skripsi.qorthony.my.id',
            pathPrefix: '/link',
          },
          category: ['BROWSABLE', 'DEFAULT'],
        },
        // Standard Deep Links (Custom Scheme)
        {
          action: 'VIEW',
          data: {
            scheme: scheme, // akan jadi 'skripsi', 'skripsidev', atau 'skripsiprev'
          },
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#232323',
          image: './assets/splash-image.png',
          dark: {
            image: './assets/splash-image.png',
            backgroundColor: '#cccccc',
          },
          imageWidth: 200,
        },
      ],
      'expo-secure-store',
      'expo-font',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'b827cbfd-33ff-4129-b03a-33ec96f28f60',
      },
    },
  }
};
