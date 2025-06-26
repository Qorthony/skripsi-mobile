import { View, Text, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { router } from 'expo-router'
import { Card } from '@/components/ui/card'
import { useSession } from '@/hooks/auth/ctx'
import { Spinner } from '@/components/ui/spinner'
import BackendRequest from '@/services/Request'
import * as Device from 'expo-device';

export default function VerifyOTP() {
    const { signIn, user } = useSession();

    console.log('user di verify otp : ', user?.email);

    const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendLoading, setResendLoading] = useState(false);
    const email = user?.email || '';

    const verifyOTP = async () => {
        setLoading(true);
        setError(null);
        try {
            let device_id = '';
            if (Platform.OS === 'android') {
                device_id = Device.deviceName || Device.osInternalBuildId || Device.modelId || '';
            }
            const res = await fetch(apiUrl+'/login/verifyOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user?.email,
                    otp_code: otp,
                    device_id: device_id,
                }),
            });

            if (!res.ok) {
                let message = `Response status: ${res.status}`;
                try {
                    const json = await res.json();
                    message = json.message || message;
                } catch {}
                setError(message);
                throw new Error(message);
            }

            const data = await res.json();
            console.log(apiUrl);
            console.log(data.token);
            signIn(data.token);
            router.replace('/');
        } catch (error: any) {
            if (error instanceof Error && error.message) {
                setError(error.message);
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleResendOtp = () => {
        if (!email) {
            console.error('Email is missing');
            return;
        }
        setResendLoading(true);
        BackendRequest({
            endpoint: '/login/resendOtp',
            method: 'POST',
            body: {
                email: email,
            },
            onStart: () => {
                console.log('Resend OTP request started');
            },
            onSuccess: (data) => {
                console.log('Resend OTP successful', data);
            },
            onError: (error) => {
                console.error('Resend OTP failed', error);
            },
            onComplete: () => {
                setResendLoading(false);
                console.log('Resend OTP request completed');
            },
        });
    };
    
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
                {error && (
                    <Text className='text-red-500 mb-2'>{error}</Text>
                )}
                <Button onPress={verifyOTP} disabled={loading}>
                    {loading ? <Spinner /> : <ButtonText>Verify</ButtonText>}
                </Button>
                <Button variant='link' className='mt-4' onPress={handleResendOtp} disabled={resendLoading}>
                    {resendLoading ? <Spinner /> : <ButtonText>Resend OTP</ButtonText>}
                </Button>
            </Card>
        </View>
    </SafeAreaView>
  )
}