import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/hooks/auth/ctx';
import BackendRequest from '@/services/Request';
import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Login() {
    const { session, setUser } = useSession();
    if (session) {
        return <Redirect href="/" />;
    }

    const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    
    const logIn = async () => {
        console.log('login button clicked');
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(apiUrl+'/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            if (!res.ok) {
                const json = await res.json();
                setError(json.message || 'Login gagal');
                throw new Error(`${json.message}`);
            }

            const data = await res.json();
            console.log(apiUrl);
            console.log(data.user?.email);
            setUser(data.user);
            router.push('/verify-otp');
        } catch (error: any) {
            if (!error.message && error instanceof Error) {
                setError(error.message);
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    

    console.log('email : ', email);
    
  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
        <View className='mx-4 my-8'>
          {/* <Text
            onPress={() => {
              signIn();
              // Navigate after signing in. You may want to tweak this to ensure sign-in is
              // successful before navigating.
              router.replace('/');
            }}>
            Sign In
          </Text> */}
            <Text className='text-2xl font-bold'>
            Selamat Datang
            </Text>
            <Text className='text-lg mb-4'>
                Silahkan login untuk melanjutkan
            </Text>
            <Card>
                <View className='mb-4'>
                    <Text className='text-lg'>
                        Email
                    </Text>
                    <Input
                        variant='underlined'
                        size='lg'
                    >
                        <InputField 
                            placeholder='example@email.com' 
                            onChangeText={setEmail} 
                            value={email} 
                        />
                    </Input>
                </View>
                
                {error && (
                    <Text className='text-red-500 mb-2'>{error}</Text>
                )}

                <Button onPress={logIn} disabled={loading}>
                    {loading ? <Spinner /> : <ButtonText>Login</ButtonText>}
                </Button>

                <Button variant='link' className='mt-4' onPress={() => {
                    router.push('/register');
                }}>
                    <ButtonText>Buat Akun</ButtonText>
                </Button>

            </Card>
        </View>
    </SafeAreaView>
  );
}
