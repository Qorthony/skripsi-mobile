import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { SessionProvider } from '@/hooks/auth/ctx';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Root() {
    const colorScheme = useColorScheme();
    // Set up the auth context and render our layout inside of it.
    return (
        <SessionProvider>
            <GluestackUIProvider mode="light">
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Slot />
                    <StatusBar style="auto" />
                </ThemeProvider>
            </GluestackUIProvider>
        </SessionProvider>
    );
}
