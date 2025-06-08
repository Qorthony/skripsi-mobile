import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { DeepLinkHelper, DeepLinkParams } from '@/helpers/deeplink';

export interface UseDeepLinkReturn {
  /** Parameter dari deep link yang terakhir diterima */
  lastParams: DeepLinkParams | null;
  /** URL lengkap dari deep link yang terakhir diterima */
  lastUrl: string | null;
  /** Apakah sedang menunggu deep link */
  isListening: boolean;
  /** Navigate ke route berdasarkan deep link params */
  navigateFromParams: (params: DeepLinkParams) => void;
  /** Generate dan share deep link */
  shareLink: (type: 'checkin' | 'events' | 'tickets' | 'transactions', id: string) => Promise<void>;
}

/**
 * Hook untuk menangani deep links
 * Automatically handles navigation dan menyediakan utilities
 */
export const useDeepLink = (autoNavigate: boolean = true): UseDeepLinkReturn => {
  const [lastParams, setLastParams] = useState<DeepLinkParams | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const navigateFromParams = (params: DeepLinkParams) => {
    try {
      if (params.checkinId) {
        router.push(`/(app)/checkin/${params.checkinId}`);
      } else if (params.eventId) {
        router.push(`/(app)/events/${params.eventId}`);
      } else if (params.ticketId) {
        router.push(`/(app)/tickets/${params.ticketId}`);
      } else if (params.transactionId) {
        router.push(`/(app)/transactions/${params.transactionId}`);
      } else {
        router.push('/(app)/(tabs)');
      }
    } catch (error) {
      console.error('Error navigating from deep link params:', error);
      router.push('/(app)/(tabs)');
    }
  };

  const handleDeepLink = (url: string) => {
    console.log('Deep link received in hook:', url);
    
    if (!DeepLinkHelper.isValidDeepLink(url)) {
      console.warn('Invalid deep link received:', url);
      return;
    }

    const params = DeepLinkHelper.parseDeepLink(url);
    
    setLastUrl(url);
    setLastParams(params);

    if (autoNavigate && params) {
      navigateFromParams(params);
    }
  };

  const shareLink = async (
    type: 'checkin' | 'events' | 'tickets' | 'transactions', 
    id: string
  ): Promise<void> => {
    try {
      const { Share } = await import('react-native');
      const link = DeepLinkHelper.generateAppLink(type, id);
      
      await Share.share({
        message: `Check this out: ${link}`,
        url: link,
        title: `Share ${type}`,
      });
    } catch (error) {
      console.error('Error sharing deep link:', error);
      throw error;
    }
  };

  useEffect(() => {
    setIsListening(true);

    // Handle initial URL (saat app dibuka dari link)
    const getInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink(initialUrl);
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };

    // Handle URL changes (saat app sudah terbuka)
    const handleUrlChange = ({ url }: { url: string }) => {
      handleDeepLink(url);
    };

    getInitialURL();
    
    const subscription = Linking.addEventListener('url', handleUrlChange);

    return () => {
      setIsListening(false);
      subscription?.remove();
    };
  }, [autoNavigate]);

  return {
    lastParams,
    lastUrl,
    isListening,
    navigateFromParams,
    shareLink,
  };
};

/**
 * Contoh penggunaan:
 * 
 * // Auto navigation (default)
 * const { lastParams, shareLink } = useDeepLink();
 * 
 * // Manual navigation
 * const { lastParams, navigateFromParams } = useDeepLink(false);
 * 
 * useEffect(() => {
 *   if (lastParams?.checkinId) {
 *     // Do something with checkin ID before navigating
 *     navigateFromParams(lastParams);
 *   }
 * }, [lastParams]);
 * 
 * // Share a link
 * await shareLink('checkin', '123');
 */
