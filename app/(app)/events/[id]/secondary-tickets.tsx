import { View, Text, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button, ButtonText } from '@/components/ui/button';
import { useSession } from '@/hooks/auth/ctx';
import { HStack } from '@/components/ui/hstack';
import { dateIdFormat } from '@/helpers/date';
import { rupiahFormat } from '@/helpers/currency';
import { Spinner } from '@/components/ui/spinner';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';

interface Event {
  nama: string;
  lokasi: string;
  kota?: string;
  jadwal_mulai: string;
  // Add other properties of the event object as needed
}

interface Ticket {
  transaction_item: {
    nama: string;
    deskripsi: string;
  };
  resale: {
    id: string;
    harga_jual: number;
  };
}

export default function SecondaryTickets() {
  const { id } = useLocalSearchParams();
  const { session } = useSession();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [event, setEvent] = useState<Event | null>(null);

  const toast = useToast(); // Initialize toast

  const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

  const getResaleTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/resales?event_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
      });
      const json = await response.json();
      setTickets(json.data.resales);
      setEvent(json.data.event);
    } catch (error) {
      console.error('Error fetching resale tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getResaleTickets();
    setRefreshing(false);
  };

  useEffect(() => {
    getResaleTickets();
  }, []);

  console.log(tickets);
  
  const eventLocation = event?.lokasi === 'online' ? 'Online' : event?.kota;

  const eventDate = event? dateIdFormat(event.jadwal_mulai):null;

  const handleBuyTicket = async (id: string) => {
    
    console.log('clicked');
    
    setButtonLoading(true); // Show spinner for the button
    try {
      const response = await fetch(`${apiUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
        body: JSON.stringify({
          ticket_source: 'secondary',
          resale_id: id,
        }),
      });
      const json = await response.json();
      if (response.ok) {
        router.push(`/transactions/${json.data.id}`);
      } else {
        // console.error('Error buying ticket:', json.message);
        toast.show({
          placement: 'top',
          duration: 3000,
          render: () => (
            <Toast action='error'>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{json.message || 'Failed to buy ticket.'}</ToastDescription>
            </Toast>
          ),
        });
      }
    } catch (error) {
      console.error('Error buying ticket:', error);
      toast.show({
        placement: 'top',
        render: () => (
          <Toast>
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>{'An unexpected error occurred.'}</ToastDescription>
          </Toast>
        ),
      });
    } finally {
      setButtonLoading(false); // Hide spinner for the button
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
      {loading ? (
        <View className='flex-1 justify-center items-center'>
          <Spinner color='indigo.600' />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className='px-2'>
            <View className='mb-4'>
              <Text>Secondary Tickets</Text>
              <Text className='font-semibold text-xl'>{event?.nama} </Text>
              <Text className='text-sm text-gray-500'>
              {eventDate} | {eventLocation}
              </Text>
            </View>

            {tickets.length === 0 && (
              <Card className='flex-1 justify-center items-center p-4'>
                <Text className='text-gray-500'>Belum ada tiket yang tersedia.</Text>
              </Card>
            )}

            {tickets.map((ticket, index) => (
              <Card key={index} className='flex-row justify-between items-center mb-2'>
                <View>
                  <Text className='font-semibold'>{ticket?.transaction_item?.nama}</Text>
                  {
                    ticket?.transaction_item?.deskripsi && (
                      <Text className='text-sm'>{ticket?.transaction_item?.deskripsi}</Text>
                    )
                  }
                  <Text className='text-purple-600 font-semibold'>{rupiahFormat(ticket?.resale?.harga_jual) }</Text>
                </View>
                <Button 
                  variant='solid' 
                  action='primary' 
                  onPress={() => handleBuyTicket(ticket?.resale?.id)} 
                  disabled={buttonLoading} // Disable button while loading
                >
                  {buttonLoading ? <Spinner color='white' /> : <ButtonText>Beli Tiket</ButtonText>}
                </Button>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}