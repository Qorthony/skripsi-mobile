import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '@/components/ui/card'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { Redirect, router } from 'expo-router'
import { useSession } from '@/hooks/auth/ctx'
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const RegisterSchema = z.object({
  email: z.string().email().nonempty('Email tidak boleh kosong'),
  name: z.string().nonempty('Nama tidak boleh kosong').min(3, 'Nama terlalu pendek'),
  phone: z.string().nonempty('No HP tidak boleh kosong').min(10, 'No HP terlalu pendek').max(15, 'No HP terlalu panjang'),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

export default function Register() {
  const { session, setUser } = useSession();
  if (session) {
      return <Redirect href="/" />;
  }

  const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

  const {control, handleSubmit, formState: { errors }} = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      name: '',
      phone: '',
    },
  });

  const submitForm = async (data: RegisterForm) => {
    console.log('Form data: ', data);
    
    try {
      const res = await fetch(apiUrl+'/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log('Response data: ', responseData);
      setUser(responseData.user);
      router.push('/verify-otp');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
        <View className='mx-4 my-8'>
          <Text className='text-2xl font-bold'>Buat Akun</Text>
          <Text className='text-lg mb-4'>Silahkan daftar untuk melanjutkan</Text>

          <Card>
            <View className='mb-4'>
              <Text>Email</Text>
              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant='underlined'
                    size='lg'
                  >
                      <InputField 
                        placeholder='example@email.com'
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                  </Input>
                )}
              />
              {errors.email && <Text className='text-red-600'>{errors.email.message}</Text>}
            </View>
            <View className='mb-4'>
              <Text>Nama</Text>
              <Text className='text-sm text-red-500 mb-2'>Nama harus sesuai KTP. Untuk keperluan verifikasi identitas</Text>
              <Controller
                control={control}
                name='name'
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant='underlined'
                    size='lg'
                  >
                      <InputField 
                        placeholder='John Doe'
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                  </Input>
                )}
              />
              {errors.name && <Text className='text-red-600'>{errors.name.message}</Text>}
            </View>
            <View className='mb-4'>
              <Text>No HP</Text>
              <Controller
                control={control}
                name='phone'
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant='underlined'
                    size='lg'
                  >
                      <InputField 
                        placeholder='6285767676...'
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                  </Input>
                )}
              />
              {errors.phone && <Text className='text-red-600'>{errors.phone.message}</Text>}
            </View>
            <Button onPress={handleSubmit(submitForm)}>
                <ButtonText>Daftar</ButtonText>
            </Button>
          </Card>
        </View>
    </SafeAreaView>
  )
}