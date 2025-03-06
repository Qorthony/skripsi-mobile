import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { router } from 'expo-router'
import { Card } from '@/components/ui/card'
import { useSession } from '@/hooks/auth/ctx'

export default function VerifyOTP() {
    const { signIn, user } = useSession();

    console.log('user di verify otp : ', user?.email);

    const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

    const [otp, setOtp] = useState('');

    const verifyOTP = async () => {
        try {
            const res = await fetch(apiUrl+'/login/verifyOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user?.email,
                    otp_code: otp,
                }),
            });

            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
            }

            const data = await res.json();
            console.log(apiUrl);
            console.log(data.token);
            signIn(data.token);
            router.replace('/');
        } catch (error) {
            console.error(error);
        }
    }
    
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
                        <InputField placeholder='123456' onChangeText={setOtp} />
                    </Input>
                </View>
                <Button onPress={verifyOTP}>
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