import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// import global css
import '@/global.css';
import { useSession } from '@/hooks/auth/ctx';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 3000,
  fade: true,
});

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { session, isLoading } = useSession();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/log-in" />;
  }

  return (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="events/[id]" options={{
            title: 'Detail Event',
          }} />
          <Stack.Screen name="events/[id]/secondary-tickets" options={{
            title: 'Kembali',
            headerShown: true,
          }} />
          <Stack.Screen name="transactions/index" options={{
            title: 'Transaction',
            headerShown: false,
          }} />
          <Stack.Screen name="transactions/payment" options={{
            title: 'Transaction Payment',
            headerShown: false,
          }} />
          <Stack.Screen name="transactions/success" options={{
            title: 'Transaction Success',
            headerShown: false,
          }} />
          <Stack.Screen name="+not-found" />
        </Stack>
  );
}
