import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { EyeIcon, Icon } from '@/components/ui/icon'
import { Card } from '@/components/ui/card'
import { IconSymbol } from '@/components/ui/IconSymbol'

export default function Checkin() {
    const {id} = useLocalSearchParams()
    console.log(id)


  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
        <View className='mx-4 my-4'>
            <Text className='text-2xl font-bold'>Checkin</Text>
            <Text className='text-lg mb-4'>Untuk memindai tiket silahkan tempelkan pada perangkat organizer</Text>
        </View>

        <Card className='mx-4 my-4'>
            <View className='flex-row justify-center items-center'>
                <Text className='text-2xl font-semibold py-40'>
                    Pindai Tiket
                </Text>
            </View>
        </Card>
    </SafeAreaView>
  )
}