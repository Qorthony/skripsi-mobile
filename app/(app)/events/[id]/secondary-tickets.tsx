import { View, Text } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button, ButtonText } from '@/components/ui/button';

export default function SecondaryTickets() {
  const { id } = useLocalSearchParams();
  console.log(id);
  
  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
        <View className='px-2'>
            <View className='mb-2'>
              <Text>Secondary Tickets</Text>
              <Text className='font-semibold text-xl'>Nama Events</Text>
            </View>

            <Card className='flex-row justify-between items-center mb-2'>
              <View>
                <Text className='font-semibold'>Ticket Name</Text>
                <Text className='text-sm'>Detail tiket</Text>
                <Text className='text-purple-600 font-semibold'>Rp. 100.000</Text>
              </View>
              <Button variant='solid' action='primary' onPress={() => {
                router.push('/transactions');
              }}>
                <ButtonText>Beli Tiket</ButtonText>
              </Button>
            </Card>
            
        </View>
    </SafeAreaView>
  )
}