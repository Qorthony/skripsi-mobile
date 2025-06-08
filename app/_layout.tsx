import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { SessionProvider } from '@/hooks/auth/ctx';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export default function Root() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        // Handle initial URL (saat app dibuka dari link)
        const getInitialURL = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                handleDeepLink(initialUrl);
            }
        };

        // Handle URL changes (saat app sudah terbuka)
        const handleUrlChange = ({ url }: { url: string }) => {
            handleDeepLink(url);
        };

        getInitialURL();
        
        const subscription = Linking.addEventListener('url', handleUrlChange);

        return () => subscription?.remove();
    }, []);

    const handleDeepLink = (url: string) => {
        console.log('Deep link received:', url);
        
        try {
            // Parse URL
            const urlObj = new URL(url);
            
            // Handle custom scheme deep links (skripsi://, skripsidev://, skripsiprev://)
            if (urlObj.protocol === 'skripsi:' || 
                urlObj.protocol === 'skripsidev:' || 
                urlObj.protocol === 'skripsiprev:') {
                
                const path = urlObj.pathname;
                
                // Navigate berdasarkan path
                if (path.startsWith('/checkin/')) {
                    const id = path.split('/')[2];
                    if (id) {
                        router.push(`/(app)/checkin/${id}`);
                    }
                } else if (path.startsWith('/events/')) {
                    const id = path.split('/')[2];
                    if (id) {
                        router.push(`/(app)/events/${id}`);
                    }
                } else if (path.startsWith('/tickets/')) {
                    const id = path.split('/')[2];
                    if (id) {
                        router.push(`/(app)/tickets/${id}`);
                    }
                } else if (path.startsWith('/transactions/')) {
                    const id = path.split('/')[2];
                    if (id) {
                        router.push(`/(app)/transactions/${id}`);
                    }                } else {
                    // Default route
                    router.push('/(app)/(tabs)');
                }
            }
            
            // Handle HTTPS links (Android App Links)
            else if (urlObj.protocol === 'https:' && 
                     urlObj.hostname === 'skripsi-thony.laravel.cloud' &&
                     urlObj.pathname.startsWith('/link/')) {
                
                const path = urlObj.pathname.replace('/link', '');
                
                if (path.startsWith('/checkin/')) {
                    const id = path.split('/')[2];
                    if (id) {
                        router.push(`/(app)/checkin/${id}`);
                    }
                } else if (path.startsWith('/events/')) {
                    const id = path.split('/')[2];
                    if (id) {
                        router.push(`/(app)/events/${id}`);
                    }
                } else if (path.startsWith('/tickets/')) {
                    const id = path.split('/')[2];
                    if (id) {
                        router.push(`/(app)/tickets/${id}`);
                    }
                } else if (path.startsWith('/transactions/')) {
                    const id = path.split('/')[2];
                    if (id) {
                        router.push(`/(app)/transactions/${id}`);
                    }
                } else {
                    // Default route
                    router.push('/(app)/(tabs)');
                }
            }        } catch (error) {
            console.error('Error parsing deep link:', error);
            // Fallback ke route default jika ada error
            router.push('/(app)/(tabs)');
        }
    };

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
