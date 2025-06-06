import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { Button, ButtonText } from '@/components/ui/button'
import { router, useLocalSearchParams } from 'expo-router'
import { useSession } from '@/hooks/auth/ctx'
import { dateIdFormat } from '@/helpers/date';
import { PaymentMethods } from '@/constants/payment-method'
import { rupiahFormat } from '@/helpers/currency';

export default function Success() {
  const { id } = useLocalSearchParams();
  
  const {session} = useSession();

  const [transaction, setTransaction] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

  const getTransaction = async () => {
    try {
      const res = await fetch(apiUrl+'/transactions/'+id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }

      let json = await res.json();
      console.log(json.data);
      
      setTransaction(json.data);
      return json.data;
    } catch (error) {
      console.error(error);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getTransaction();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getTransaction();
  }, []);

  const eventLocation = transaction?.event?.lokasi === 'online'? 'Online':transaction?.event?.kota;

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Card className='mx-2 mb-2 justify-center'>
          <Text className='text-xl font-semibold text-center'>Pemesanan Berhasil</Text>
          <Text className='text-center'> {transaction?.event?.nama} </Text>
          <Text className='text-center'>{eventLocation} - {dateIdFormat(transaction?.event?.jadwal_mulai)}</Text>
        </Card>

        <Card
          className='mx-2 mb-2'
        >
          <Text className='text-lg font-bold mb-2'>Detail Pembayaran</Text>
          <View className='flex-row justify-between'>
            <Text className='text-sm text-gray-400'>Metode Pembayaran</Text>
            <Text>{ transaction?.metode_pembayaran ? PaymentMethods[transaction.metode_pembayaran]:"" }</Text>
          </View>
          <View className='flex-row justify-between'>
            <Text className='text-sm text-gray-400'>Nominal Pembayaran</Text>
            <Text>{rupiahFormat(transaction?.total_pembayaran)}</Text>
          </View>
        </Card>

        {
          transaction?.transaction_items.map((item: any, i: number) => (
            item.ticket_issueds.map((ticket: any, j: number) => (
              <Card
                key={j}
                className='mx-2 mb-2'
              >
                <Text className='text-lg font-bold mb-2'>Detail Peserta {j+1}</Text>
                <View className='mb-1'>
                  <Text className='text-sm text-gray-400'>Email :</Text>
                  <Text>{ ticket?.user ? ticket.user?.email : ticket.email_penerima } </Text>
                </View>
                <View className='mb-1'>
                  <Text className='text-sm text-gray-400'>Nama :</Text>
                  <Text>{ ticket?.user?.name }</Text>
                </View>
                <View className='mb-1'>
                  <Text className='text-sm text-gray-400'>Kategori Tiket :</Text>
                  <Text>{item?.nama} </Text>
                </View>
              </Card>
            ))
          ))
        }

        <Card
          className='mx-2 mb-2'
        >
          <View className='flex-row justify-around'>
            <Button 
              size="md" 
              variant="outline" 
              action="primary"
              onPress={() => {
                router.push('/transactions')
              }}
            >
              <ButtonText>Daftar Transaksi</ButtonText>
            </Button>
            <Button 
              size="md" 
              variant="solid" 
              action="primary" 
              onPress={() => {
                console.log('Tikat Saya');
                router.push('/my-tickets')
              }}
            >
              <ButtonText>Tiket Saya</ButtonText>
            </Button>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}