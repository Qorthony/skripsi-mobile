import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CountdownTimer from '@/components/CountdownTimer'
import { Card } from '@/components/ui/card'
import { CopyIcon, EditIcon, Icon, InfoIcon } from '@/components/ui/icon'
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useSession } from '@/hooks/auth/ctx'
import { PaymentMethods } from '@/constants/payment-method'
import { rupiahFormat } from '@/helpers/currency';

export default function Payment() {
  const { id } = useLocalSearchParams();

  const {session} = useSession();

  const [transaction, setTransaction] = useState<any>(null);

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

  useEffect(() => {
    getTransaction();
  }, [id]);

  const copyToClipboard = async (value:string) => {
    console.log(value);
    
    await Clipboard.setStringAsync(value);
  };

  const handleCheckStatus = async () => {
    console.log('Check Status');

    const transactionData = await getTransaction();

    if (transactionData.status === 'success') {
      router.replace(`/transactions/${id}/success`);
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
        <View className='flex-1 mx-2'>
          <Text>Payment</Text>
          <View className='flex-row mb-2 justify-between items-center p-2 bg-yellow-300 rounded-md'>
            <Text>Selesaikan transaksi sebelum </Text>
            <CountdownTimer
              initialSeconds={900}
              containerClassName='bg-white rounded-md px-2 py-1'
              textClassName='text-red-500'
            />
          </View>

          <Card className='mb-2'>
            <View className='mb-1'>
              <Text className='text-sm text-gray-400'>Metode Pembayaran</Text>
              <Text> { transaction?.metode_pembayaran ? PaymentMethods[transaction.metode_pembayaran]:"" } </Text>
            </View>
            <View className='mb-1'>
              <Text className='text-sm text-gray-400'>No. Virtual Account</Text>
              <Pressable onPress={() => {
                copyToClipboard(transaction?.detail_pembayaran.va_number)
              }}>
                <Text> { transaction?.detail_pembayaran.va_number } <Icon as={CopyIcon} size='xs' /> </Text>
              </Pressable>
            </View>
            <View className='mb-1'>
              <Text className='text-sm text-gray-400'>Nominal Pembayaran</Text>
              <Pressable onPress={() => {
                copyToClipboard(transaction?.total_pembayaran)
              }}>
                <Text>{ rupiahFormat(transaction?.total_pembayaran) } <Icon as={CopyIcon} size='xs' /> </Text>
              </Pressable>
            </View>
          </Card>

          <Card>
            <View className='flex-row justify-around items-center'>
              <Pressable
                className='bg-white border border-gray-500 rounded-lg p-2 justify-center flex-row items-center'
                onPress={() => console.log('change payment method')}
              >
                <Icon as={EditIcon} size='xs' className='text-gray-500'/>
                <Text className='text-sm text-gray-500 text-center'> Ganti Pembayaran</Text>
              </Pressable>

              <Pressable
                className='bg-purple-600 rounded-lg p-2 justify-center flex-row items-center'
                onPress={handleCheckStatus}
              >
                <Icon as={InfoIcon} size='xs' className='text-white'/>
                <Text className='text-sm text-white text-center'> Cek Status</Text>
              </Pressable>
            </View>
          </Card>
        </View>
    </SafeAreaView>
  )
}