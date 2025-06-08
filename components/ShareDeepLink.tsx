import React from 'react';
import { Alert, Share } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { DeepLinkHelper } from '@/helpers/deeplink';

interface ShareDeepLinkProps {
  type: 'checkin' | 'events' | 'tickets' | 'transactions';
  id: string;
  title?: string;
}

export const ShareDeepLink: React.FC<ShareDeepLinkProps> = ({ 
  type, 
  id, 
  title = 'Share Link' 
}) => {
  
  const shareCustomLink = async () => {
    try {
      const link = DeepLinkHelper.generateCustomLink(type, id);
      await Share.share({
        message: `Check this out: ${link}`,
        url: link,
        title: title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share link');
    }
  };

  const shareAppLink = async () => {
    try {
      const link = DeepLinkHelper.generateAppLink(type, id);
      await Share.share({
        message: `Check this out: ${link}`,
        url: link,
        title: title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share app link');
    }
  };

  const copyToClipboard = async () => {
    try {
      const Clipboard = await import('expo-clipboard');
      const link = DeepLinkHelper.generateAppLink(type, id);
      await Clipboard.setStringAsync(link);
      Alert.alert('Success', 'Link copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  return (
    <VStack space="md">
      <HStack space="sm">
        <Button action="primary" onPress={shareCustomLink} className="flex-1">
          <ButtonText>Share App Link</ButtonText>
        </Button>
        
        <Button action="secondary" onPress={shareAppLink} className="flex-1">
          <ButtonText>Share Web Link</ButtonText>
        </Button>
      </HStack>
      
      <Button action="default" onPress={copyToClipboard}>
        <ButtonText>Copy Link</ButtonText>
      </Button>
    </VStack>
  );
};

/**
 * Contoh penggunaan dalam komponen:
 * 
 * <ShareDeepLink 
 *   type="checkin" 
 *   id="123" 
 *   title="Share Check-in Link" 
 * />
 * 
 * <ShareDeepLink 
 *   type="events" 
 *   id="456" 
 *   title="Share Event" 
 * />
 */
