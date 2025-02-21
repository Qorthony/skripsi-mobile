import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '@/components/ui/card'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { router } from 'expo-router'

export default function Register() {
  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
        <View className='mx-4 my-8'>
          <Text className='text-2xl font-bold'>Buat Akun</Text>
          <Text className='text-lg mb-4'>Silahkan daftar untuk melanjutkan</Text>

          <Card>
            <View className='mb-4'>
              <Text>Email</Text>
                <Input
                variant='underlined'
                size='lg'
                >
                    <InputField placeholder='example@email.com'/>
                </Input>
            </View>
            <View className='mb-4'>
              <Text>Nama</Text>
                <Input
                variant='underlined'
                size='lg'
                >
                    <InputField placeholder='John Doe'/>
                </Input>
            </View>
            <View className='mb-4'>
              <Text>No HP</Text>
                <Input
                variant='underlined'
                size='lg'
                >
                    <InputField placeholder='6285767676...'/>
                </Input>
            </View>
            <Button onPress={() => {
              router.push('/verify-otp');
            }}>
                <ButtonText>Daftar</ButtonText>
            </Button>
          </Card>
        </View>
    </SafeAreaView>
  )
}