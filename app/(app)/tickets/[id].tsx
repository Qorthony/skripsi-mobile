import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card } from '@/components/ui/card';
import { useLocalSearchParams } from 'expo-router';

const TicketDetail = () => {
  const { id } = useLocalSearchParams();

  // Placeholder data, replace with API call or state management
  const ticket = {
    name: 'VIP Ticket',
    event: 'React Native Conference 2025',
    date: 'April 20, 2025',
    location: 'Jakarta Convention Center',
    price: 'Rp 1,000,000',
    status: 'Active',
  };

  return (
    <View className="flex-1 bg-slate-100 p-4">
      <Card className="p-4">
        <View className="items-center mb-6">
          <Image
            source={require('@/assets/images/dummy_poster.png')}
            className="w-40 h-40 rounded-lg mb-4"
          />
          <Text className="text-xl font-extrabold text-black mb-2">{ticket.event}</Text>
          <Text className="text-lg font-semibold text-purple-600">{ticket.name}</Text>
        </View>
        <View className="space-y-4">
          <View>
            <Text className="text-sm text-gray-500">Tanggal</Text>
            <Text className="text-base font-normal">{ticket.date}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Lokasi</Text>
            <Text className="text-base font-normal">{ticket.location}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Harga</Text>
            <Text className="text-base font-normal">{ticket.price}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Status</Text>
            <Text className="text-base font-normal">{ticket.status}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default TicketDetail;