import { View, Text, Image } from 'react-native'
import React from 'react'
import { dateIdFormat } from '@/helpers/date';
import { EventTypes } from '@/constants/events-data'

type PropTypes = {
    name: string;
    description?: string;
    image?: any;
    date: string;
    location: string;
    city?: string|null;
    event_link?: string|null;
}

export default function FullWidthEventCard({ 
    name, 
    description, 
    image,
    date,
    location,
    city,
    event_link 
}: PropTypes) {
    return (
        <View className='flex-1 bg-gray-100 m-2 rounded-lg'>
            <Image source={image? { uri: image }: require('@/assets/images/dummy_poster.png')} className='w-full h-48 rounded-lg' />
            <View className='p-2'>
                <Text className='font-bold'>
                    {name}
                </Text>
                <Text className='text-sm'>
                    {dateIdFormat(date)}
                </Text>
                <Text className='text-sm'>
                    {location=='online'?'Online':city}
                </Text>
            </View>
        </View>
    )
}