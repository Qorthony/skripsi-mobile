import { View, Text, ScrollView, Pressable, Button, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CountdownTimer from '@/components/CountdownTimer'
import { Card } from '@/components/ui/card'
import ParticipantForms from '@/components/ParticipantForms'
import AbsoluteBottomView from '@/components/AbsoluteBottomView'
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer'
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio'
import { CircleIcon, EditIcon, Icon } from '@/components/ui/icon'
import { Divider } from '@/components/ui/divider'
import { router } from 'expo-router'


export default function Transaction() {
  const [participant, setParticipant] = useState([
    {
      name: '',
      email: '',
      ticket: ''
    },
    {
      name: '',
      email: '',
      ticket: ''
    },
    {
      name: '',
      email: '',
      ticket: ''
    }
  ])

  const [openPaymentOptions, setOpenPaymentOptions] = useState(false)

  const PAYMENT_OPTIONS = [
    {
      name: 'BRIVA',
      icon: 'bank-transfer',
      code: 'bri'
    },
    {
      name: 'BCA VA',
      icon: 'credit-card',
      code: 'bca'
    },
    {
      name: 'Gopay',
      icon: 'paypal',
      code: 'gopay'
    }
  ]

  const [selectedPayment, setSelectedPayment] = useState('')

  useEffect(() => {
    console.log(selectedPayment)
  }, [selectedPayment])

  return (
    <SafeAreaView
      className='flex-1 bg-slate-100'
    >
      <ScrollView
        className='flex-1 mx-2 mb-16'
        showsVerticalScrollIndicator={false}
      >
        <Text className='mb-2'>Transaction Form Page</Text>
        <View className='flex-row mb-2 justify-between items-center p-2 bg-yellow-300 rounded-md'>
          <Text>Selesaikan transaksi sebelum </Text>
          <CountdownTimer
            initialSeconds={900}
            containerClassName='bg-white rounded-md px-2 py-1'
            textClassName='text-red-500'
          />
        </View>

        <Card
          size='sm'
        >
          <Text className='font-bold text-lg'>Nama Event</Text>
          <View className='flex-row justify-between'>
            <View className='flex-row'>
              <Text className='text-sm text-gray-600'>Jakarta | </Text>
              <Text className='text-sm text-gray-600'>12 March 2025</Text>
            </View>
          </View>
        </Card>

        <View className='mt-2'>
          <Card size='sm'>
            <Text className='text-lg font-bold mb-2'>Isi Data Peserta</Text>

            {
              participant.map((_, index) => (
                <ParticipantForms className='mb-5' key={index} />
              ))
            }
          </Card>
        </View>

        <Card
          size='sm'
          className='mt-2 mb-10'
        >
          <Text className='text-lg font-bold mb-2'>Ringkasan Pembayaran</Text>
          <View className='flex-row justify-between'>
            <View>
              <Text className='text-sm'>UX Research</Text>
              <Text className='text-gray-400'>1x</Text>
            </View>
            <Text className='text-sm'>Rp. 150000</Text>
          </View>
          <View className='flex-row justify-between'>
            <View>
              <Text className='text-sm'>Biaya Layanan</Text>
            </View>
            <Text className='text-sm'>Rp. 150000</Text>
          </View>
          <Divider className='my-2' />
          <View className='flex-row justify-between'>
            <Text className='font-semibold'>Total Pembayaran</Text>
            <Text>Rp. 150000</Text>
          </View>
        </Card>

      </ScrollView>

      <AbsoluteBottomView>
        <View className='flex-row justify-between items-center'>
          <View>
            {
              selectedPayment === '' ?
              '':
              <Pressable className='flex-row items-center' onPress={() => setOpenPaymentOptions(true)} >
                <Text className='text-sm'>{PAYMENT_OPTIONS.find((value)=>value.code===selectedPayment)?.name} </Text>
                  <Icon as={EditIcon} size='sm'/>
              </Pressable>
            }
            <View className='flex-row'>
              <Text className='font-bold'>Rp. 150000</Text>
            </View>
          </View>
          {
            selectedPayment === '' ?
            <Pressable
              className='bg-purple-600 rounded-lg p-2 justify-center'
              onPress={() => setOpenPaymentOptions(true)}
            >
              <Text className='text-white text-center'>Pilih pembayaran</Text>
            </Pressable>
            :
            <Pressable
              className='bg-purple-600 rounded-lg p-2 justify-center'
              onPress={() => router.push('/transactions/payment')}
            >
              <Text className='text-white text-center'>Bayar Sekarang</Text>
            </Pressable>
          }
        </View>
      </AbsoluteBottomView>

      <Drawer
        isOpen={openPaymentOptions}
        onClose={() => {
          setOpenPaymentOptions(false)
        }}
        size="full"
        anchor="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader className='border-b'>
            <Text className='text-xl py-2'>Metode Pembayaran</Text>
          </DrawerHeader>
          <DrawerBody>
            <RadioGroup 
              className='mb-2' 
              value={selectedPayment}
              onChange={(value) => {
                setSelectedPayment(value)
              }}
            >
            {
              PAYMENT_OPTIONS.map((option, index) => (
                  <Radio
                    key={index} 
                    value={option.code} 
                    size="lg" 
                    isInvalid={false} 
                    isDisabled={false}
                  >
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>{option.name}</RadioLabel>
                  </Radio>
              ))
            }
            </RadioGroup>
          </DrawerBody>
          <DrawerFooter>
            <Pressable
              onPress={() => {
                setOpenPaymentOptions(false)
              }}
              className="flex-1 bg-purple-600 rounded-lg p-2"
            >
              <Text className='text-white text-center'>Pilih</Text>
            </Pressable>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </SafeAreaView>
  )
}