import { View, Text, Pressable } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CounterButton() {
    return (
        <View className='flex-row items-center'>
            <Pressable
                onPress={() => console.log('minus')}
            >
                <AntDesign name="minuscircleo" size={14} color="black" />
            </Pressable>
            <Text className='px-2 text-sm'>0</Text>
            <Pressable
                onPress={() => console.log('plus')}
            >
                <AntDesign name="pluscircleo" size={14} color="black" />
            </Pressable>
        </View>
    )
}