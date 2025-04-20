import { View, Text, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button, ButtonText } from '@/components/ui/button';
import { useSession } from '@/hooks/auth/ctx';

interface Event {
  nama: string;
  // Add other properties of the event object as needed
}

interface Ticket {
  transaction_item: {
    nama: string;
    deskripsi: string;
  };
  resale: {
    harga_jual: number;
  };
}

export default function SecondaryTickets() {
  const { id } = useLocalSearchParams();
  const { session } = useSession();

  const [refreshing, setRefreshing] = useState(false);
  // interface Ticket {
  //   nama: string;
  //   deskripsi: string;
  //   ticket_issueds: {
  //     resale: {
  //       harga_jual: number;
  //     };
  //   }[];
  // }

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [event, setEvent] = useState<Event | null>(null);

  const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

  const getResaleTickets = async () => {
    try {
      const response = await fetch(`${apiUrl}/events/${id}/resales`, {
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
  

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className='px-2'>
          <View className='mb-2'>
            <Text>Secondary Tickets</Text>
            <Text className='font-semibold text-xl'> {event?.nama} </Text>
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
                <Text className='text-sm'>{ticket?.transaction_item?.deskripsi}</Text>
                <Text className='text-purple-600 font-semibold'>Rp. {ticket?.resale?.harga_jual}</Text>
              </View>
              <Button variant='solid' action='primary' onPress={() => {
                router.push('/transactions');
              }}>
                <ButtonText>Beli Tiket</ButtonText>
              </Button>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}