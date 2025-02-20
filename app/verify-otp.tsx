import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { router } from 'expo-router'
import { Card } from '@/components/ui/card'
import { useSession } from '@/hooks/auth/ctx'

export default function VerifyOTP() {
    const { signIn } = useSession();
  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
        <View className='mx-4 my-8'>
            <Text className='text-2xl font-bold'>
            Verify OTP
            </Text>
            <Text className='text-lg mb-4'>
                Silahkan masukkan OTP yang telah dikirimkan ke email Anda
            </Text>
            <Card>
                <View className='mb-4'>
                    <Text className='text-lg'>
                        OTP
                    </Text>
                    <Input
                        variant='underlined'
                        size='lg'
                    >
                        <InputField placeholder='123456' />
                    </Input>
                </View>
                <Button onPress={() => {
                    signIn();
                    router.replace('/');
                }}>
                    <ButtonText>Verify</ButtonText>
                </Button>
                <Button variant='link' className='mt-4'>
                    <ButtonText>Resend OTP</ButtonText>
                </Button>
            </Card>
        </View>
    </SafeAreaView>
  )
}