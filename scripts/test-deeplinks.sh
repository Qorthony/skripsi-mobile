#!/bin/bash

# Deep Link Testing Script untuk Aplikasi Skripsi
# Usage: bash test-deeplinks.sh [android|ios] [variant]

PLATFORM=${1:-android}
VARIANT=${2:-prod}

# Set package name berdasarkan variant
case $VARIANT in
  "dev")
    PACKAGE="com.qorthony.skripsi.dev"
    SCHEME="skripsidev"
    ;;
  "preview")
    PACKAGE="com.qorthony.skripsi.preview"
    SCHEME="skripsiprev"
    ;;
  "prod")
    PACKAGE="com.qorthony.skripsi"
    SCHEME="skripsi"
    ;;
  *)
    echo "Unknown variant: $VARIANT"
    echo "Usage: bash test-deeplinks.sh [android|ios] [dev|preview|prod]"
    exit 1
    ;;
esac

echo "Testing deep links for $PLATFORM - $VARIANT variant"
echo "Package: $PACKAGE"
echo "Scheme: $SCHEME"
echo ""

if [ "$PLATFORM" = "android" ]; then
  echo "Testing Android deep links..."
  echo ""
  
  echo "1. Testing checkin deep link:"
  echo "   adb shell am start -a android.intent.action.VIEW -d \"$SCHEME://checkin/123\" $PACKAGE"
  adb shell am start -a android.intent.action.VIEW -d "$SCHEME://checkin/123" $PACKAGE
  echo ""
  
  echo "2. Testing events deep link:"
  echo "   adb shell am start -a android.intent.action.VIEW -d \"$SCHEME://events/456\" $PACKAGE"
  adb shell am start -a android.intent.action.VIEW -d "$SCHEME://events/456" $PACKAGE
  echo ""
  
  echo "3. Testing tickets deep link:"
  echo "   adb shell am start -a android.intent.action.VIEW -d \"$SCHEME://tickets/789\" $PACKAGE"
  adb shell am start -a android.intent.action.VIEW -d "$SCHEME://tickets/789" $PACKAGE
  echo ""
  
  echo "4. Testing transactions deep link:"
  echo "   adb shell am start -a android.intent.action.VIEW -d \"$SCHEME://transactions/101112\" $PACKAGE"
  adb shell am start -a android.intent.action.VIEW -d "$SCHEME://transactions/101112" $PACKAGE
  echo ""
  
  echo "5. Testing HTTPS app link:"
  echo "   adb shell am start -a android.intent.action.VIEW -d \"https://skripsi-thony.laravel.cloud/link/checkin/123\" $PACKAGE"
  adb shell am start -a android.intent.action.VIEW -d "https://skripsi-thony.laravel.cloud/link/checkin/123" $PACKAGE
  echo ""

elif [ "$PLATFORM" = "ios" ]; then
  echo "Testing iOS deep links..."
  echo ""
  
  echo "1. Testing checkin deep link:"
  echo "   xcrun simctl openurl booted \"$SCHEME://checkin/123\""
  xcrun simctl openurl booted "$SCHEME://checkin/123"
  echo ""
  
  echo "2. Testing events deep link:"
  echo "   xcrun simctl openurl booted \"$SCHEME://events/456\""
  xcrun simctl openurl booted "$SCHEME://events/456"
  echo ""
  
  echo "3. Testing tickets deep link:"
  echo "   xcrun simctl openurl booted \"$SCHEME://tickets/789\""
  xcrun simctl openurl booted "$SCHEME://tickets/789"
  echo ""
  
  echo "4. Testing transactions deep link:"
  echo "   xcrun simctl openurl booted \"$SCHEME://transactions/101112\""
  xcrun simctl openurl booted "$SCHEME://transactions/101112"
  echo ""
  
  echo "5. Testing HTTPS app link:"
  echo "   xcrun simctl openurl booted \"https://skripsi-thony.laravel.cloud/link/checkin/123\""
  xcrun simctl openurl booted "https://skripsi-thony.laravel.cloud/link/checkin/123"
  echo ""
else
  echo "Unknown platform: $PLATFORM"
  echo "Usage: bash test-deeplinks.sh [android|ios] [dev|preview|prod]"
  exit 1
fi

echo "Deep link testing completed!"
echo ""
echo "Expected behavior:"
echo "- App should open and navigate to the corresponding screen"
echo "- Check console logs for 'Deep link received:' messages"
echo "- Verify correct parameters are parsed"
echo ""
echo "Troubleshooting:"
echo "- Make sure the app is installed on the device/simulator"
echo "- For Android: Ensure ADB is connected (adb devices)"
echo "- For iOS: Ensure simulator is running"
echo "- Check that intent filters are properly configured in app.config.js"
