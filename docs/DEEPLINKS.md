# Deep Links Setup untuk Aplikasi Skripsi

## Overview
Aplikasi ini mendukung dua jenis deep links:
1. **Custom Scheme Deep Links** - untuk navigasi antar aplikasi
2. **Android App Links (HTTPS)** - untuk integrasi web dan universal links

## URL Schemes

### Custom Scheme
- **Production**: `skripsi://`
- **Preview**: `skripsiprev://`
- **Development**: `skripsidev://`

### HTTPS App Links
- **Base URL**: `https://skripsi-thony.laravel.cloud/link/`

## Supported Routes

| Type | Custom Scheme | HTTPS App Link | Navigate To |
|------|---------------|----------------|-------------|
| Check-in | `skripsi://checkin/{id}` | `https://skripsi-thony.laravel.cloud/link/checkin/{id}` | `/(app)/checkin/{id}` |
| Events | `skripsi://events/{id}` | `https://skripsi-thony.laravel.cloud/link/events/{id}` | `/(app)/events/{id}` |
| Tickets | `skripsi://tickets/{id}` | `https://skripsi-thony.laravel.cloud/link/tickets/{id}` | `/(app)/tickets/{id}` |
| Transactions | `skripsi://transactions/{id}` | `https://skripsi-thony.laravel.cloud/link/transactions/{id}` | `/(app)/transactions/{id}` |

## Implementation

### 1. Configuration
Deep links dikonfigurasi di `app.config.js`:
```javascript
android: {
  intentFilters: [
    // Android App Links (HTTPS)
    {
      action: 'VIEW',
      autoVerify: true,
      data: {
        scheme:'https',
        host: 'skripsi-thony.laravel.cloud',
        pathPrefix: '/link',
      },
      category: ['BROWSABLE', 'DEFAULT'],
    },
    // Standard Deep Links (Custom Scheme)
    {
      action: 'VIEW',
      data: {
        scheme: scheme, // dynamic berdasarkan variant
      },
      category: ['BROWSABLE', 'DEFAULT'],
    },
  ],
}
```

### 2. Handling di App
Deep links ditangani di root layout (`app/_layout.tsx`) dengan:
- Event listener untuk URL changes
- Automatic parsing dan navigation
- Error handling untuk invalid links

### 3. Helper Functions
Gunakan `DeepLinkHelper` class untuk:
```typescript
// Generate links
const link = DeepLinkHelper.generateCustomLink('checkin', '123');
const appLink = DeepLinkHelper.generateAppLink('events', '456');

// Parse links
const params = DeepLinkHelper.parseDeepLink(url);

// Validate links
const isValid = DeepLinkHelper.isValidDeepLink(url);
```

### 4. React Hook
Gunakan `useDeepLink` hook untuk:
```typescript
const { lastParams, shareLink } = useDeepLink();

// Share link
await shareLink('checkin', '123');
```

## Android App Links Setup

### 1. Generate SHA256 Fingerprint
```bash
eas credentials -p android --profile production
eas credentials -p android --profile preview
eas credentials -p android --profile development
```

### 2. Setup assetlinks.json
Buat file di Laravel backend:
```php
// routes/web.php
Route::get('/.well-known/assetlinks.json', function () {
    return response()->json([
        [
            "relation" => ["delegate_permission/common.handle_all_urls"],
            "target" => [
                "namespace" => "android_app",
                "package_name" => "com.qorthony.skripsi",
                "sha256_cert_fingerprints" => ["YOUR_SHA256_FINGERPRINT"]
            ]
        ],
        // ... other variants
    ]);
});
```

### 3. Verify Setup
Cek file dapat diakses:
```
https://skripsi-thony.laravel.cloud/.well-known/assetlinks.json
```

## Testing

### Manual Testing
```bash
# Android
bash scripts/test-deeplinks.sh android prod
bash scripts/test-deeplinks.sh android dev

# iOS
bash scripts/test-deeplinks.sh ios prod
```

### Individual Commands
```bash
# Android custom scheme
adb shell am start -a android.intent.action.VIEW -d "skripsi://checkin/123" com.qorthony.skripsi

# Android HTTPS
adb shell am start -a android.intent.action.VIEW -d "https://skripsi-thony.laravel.cloud/link/checkin/123" com.qorthony.skripsi

# iOS
xcrun simctl openurl booted "skripsi://checkin/123"
```

## Usage Examples

### 1. Share Deep Link dari Component
```tsx
import { ShareDeepLink } from '@/components/ShareDeepLink';

<ShareDeepLink 
  type="checkin" 
  id="123" 
  title="Share Check-in" 
/>
```

### 2. Handle Deep Link di Custom Component
```tsx
import { useDeepLink } from '@/hooks/useDeepLink';

const MyComponent = () => {
  const { lastParams } = useDeepLink();
  
  useEffect(() => {
    if (lastParams?.checkinId) {
      // Handle checkin deep link
      console.log('Received checkin ID:', lastParams.checkinId);
    }
  }, [lastParams]);
};
```

### 3. Generate Link di Backend (Laravel)
```php
// Helper function
function generateDeepLink($type, $id, $scheme = 'skripsi') {
    return $scheme . '://' . $type . '/' . $id;
}

// Usage
$deepLink = generateDeepLink('checkin', $ticket->id);
$appLink = 'https://skripsi-thony.laravel.cloud/link/checkin/' . $ticket->id;
```

## Troubleshooting

### 1. Deep Link Tidak Berfungsi
- Pastikan intent filters benar di `app.config.js`
- Check console logs untuk error parsing
- Verify app variant dan scheme sesuai

### 2. Android App Links Gagal
- Verify `assetlinks.json` dapat diakses via HTTPS
- Check SHA256 fingerprint sesuai dengan build
- Pastikan `autoVerify: true` di intent filter

### 3. Navigation Error
- Check route path sesuai dengan Expo Router struktur
- Verify ID parameter valid
- Pastikan user sudah login (jika required)

## Security Considerations

1. **Validate Parameters**: Selalu validate ID dan parameter dari deep link
2. **Authentication**: Check user login status sebelum navigate ke protected routes
3. **Rate Limiting**: Implement rate limiting untuk prevent abuse
4. **Input Sanitization**: Sanitize parameter sebelum digunakan
