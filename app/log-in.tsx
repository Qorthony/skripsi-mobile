import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { useSession } from '@/hooks/auth/ctx';
import { Link, Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SignIn() {
    const { session, isLoading } = useSession();
    if (session) {
        return <Redirect href="/" />;
    }
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
                        <InputField placeholder='example@email.com' />
                    </Input>
                </View>

                <Link href='/verify-otp' asChild>
                    <Button>
                        <ButtonText>Login</ButtonText>
                    </Button>
                </Link>

                <Button variant='link' className='mt-4'>
                    <ButtonText>Register</ButtonText>
                </Button>

            </Card>
        </View>
    </SafeAreaView>
  );
}
