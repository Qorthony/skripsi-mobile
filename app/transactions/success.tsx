import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { Button, ButtonText } from '@/components/ui/button'
import { router } from 'expo-router'

export default function Success() {
  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
      <Card className='mx-2 mb-2 justify-center'>
        <Text className='text-xl font-semibold text-center'>Pemesanan Berhasil</Text>
        <Text className='text-center'>Nama Event</Text>
        <Text className='text-center'>Jakarta - 12 February 2025</Text>
      </Card>

      <Card
        className='mx-2 mb-2'
      >
        <Text className='text-lg font-bold mb-2'>Detail Pembayaran</Text>
        <View className='flex-row justify-between'>
          <Text className='text-sm text-gray-400'>Metode Pembayaran</Text>
          <Text>BRIVA</Text>
        </View>
        <View className='flex-row justify-between'>
          <Text className='text-sm text-gray-400'>No. Virtual Account</Text>
          <Text>111189899898</Text>
        </View>
        <View className='flex-row justify-between'>
          <Text className='text-sm text-gray-400'>Nominal Pembayaran</Text>
          <Text>Rp. 150000</Text>
        </View>
      </Card>

      <Card
        className='mx-2 mb-2'
      >
        <Text className='text-lg font-bold mb-2'>Detail Peserta</Text>
        <View className='flex-row justify-between'>
          <Text className='text-sm'>Nama</Text>
          <Text>John Doe</Text>
        </View>
        <View className='flex-row justify-between'>
          <Text className='text-sm'>Email</Text>
          <Text>john@doe.com </Text>
        </View>
        <View className='flex-row justify-between'>
          <Text className='text-sm'>No. HP</Text>
          <Text>08123456789</Text>
        </View>
      </Card>

      <Card
        className='mx-2 mb-2'
      >
        <View className='flex-row justify-around'>
          <Button size="md" variant="outline" action="primary">
            <ButtonText>Daftar Transaksi</ButtonText>
          </Button>
          <Button size="md" variant="solid" action="primary" onPress={() => {
            console.log('Tikat Saya');
            router.push('/my-tickets')
          }}>
            <ButtonText>Tiket Saya</ButtonText>
          </Button>
        </View>
      </Card>
    </SafeAreaView>
  )
}