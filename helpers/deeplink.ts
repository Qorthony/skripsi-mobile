/**
 * Deep Link Helper untuk aplikasi Skripsi
 * Membantu generate dan parse deep links
 */

export interface DeepLinkParams {
  checkinId?: string;
  eventId?: string;
  ticketId?: string;
  transactionId?: string;
}

export class DeepLinkHelper {
  private static getScheme(): string {
    const variant = process.env.APP_VARIANT || 'production';
    
    switch (variant) {
      case 'development':
        return 'skripsidev';
      case 'preview':
        return 'skripsiprev';
      default:
        return 'skripsi';
    }
  }

  /**
   * Generate custom scheme deep link
   */
  static generateCustomLink(type: 'checkin' | 'events' | 'tickets' | 'transactions', id: string): string {
    const scheme = this.getScheme();
    return `${scheme}://${type}/${id}`;
  }

  /**
   * Generate HTTPS app link
   */
  static generateAppLink(type: 'checkin' | 'events' | 'tickets' | 'transactions', id: string): string {
    return `https://skripsi-thony.laravel.cloud/link/${type}/${id}`;
  }

  /**
   * Parse deep link URL dan extract parameter
   */
  static parseDeepLink(url: string): DeepLinkParams | null {
    try {
      const urlObj = new URL(url);
      const params: DeepLinkParams = {};

      let path = '';
      
      // Handle custom scheme
      if (urlObj.protocol.startsWith('skripsi')) {
        path = urlObj.pathname;
      }
      // Handle HTTPS app links
      else if (urlObj.protocol === 'https:' && 
               urlObj.hostname === 'skripsi-thony.laravel.cloud' &&
               urlObj.pathname.startsWith('/link/')) {
        path = urlObj.pathname.replace('/link', '');
      }

      if (path.startsWith('/checkin/')) {
        params.checkinId = path.split('/')[2];
      } else if (path.startsWith('/events/')) {
        params.eventId = path.split('/')[2];
      } else if (path.startsWith('/tickets/')) {
        params.ticketId = path.split('/')[2];
      } else if (path.startsWith('/transactions/')) {
        params.transactionId = path.split('/')[2];
      }

      return params;
    } catch (error) {
      console.error('Error parsing deep link:', error);
      return null;
    }
  }

  /**
   * Check apakah URL adalah deep link yang valid untuk app ini
   */
  static isValidDeepLink(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Custom scheme check
      if (urlObj.protocol === 'skripsi:' || 
          urlObj.protocol === 'skripsidev:' || 
          urlObj.protocol === 'skripsiprev:') {
        return true;
      }
      
      // HTTPS app link check
      if (urlObj.protocol === 'https:' && 
          urlObj.hostname === 'skripsi-thony.laravel.cloud' &&
          urlObj.pathname.startsWith('/link/')) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}

/**
 * Contoh penggunaan:
 * 
 * // Generate links
 * const checkinLink = DeepLinkHelper.generateCustomLink('checkin', '123');
 * // Result: skripsi://checkin/123
 * 
 * const appLink = DeepLinkHelper.generateAppLink('events', '456');
 * // Result: https://skripsi-thony.laravel.cloud/link/events/456
 * 
 * // Parse links
 * const params = DeepLinkHelper.parseDeepLink('skripsi://checkin/123');
 * // Result: { checkinId: '123' }
 * 
 * // Validate links
 * const isValid = DeepLinkHelper.isValidDeepLink('skripsi://checkin/123');
 * // Result: true
 */
