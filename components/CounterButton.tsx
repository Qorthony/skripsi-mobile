import { View, Text, Pressable } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

interface CounterButtonProps {
    onSubstract: () => void;
    onAdd: () => void;
    value: number;
    disabled?: boolean | undefined;
}

export default function CounterButton({
    onSubstract,
    onAdd,
    value,
    disabled = false
}: CounterButtonProps) {
    return (
        <View className='flex-row items-center'>
            <Pressable
                disabled={disabled}
                onPress={onSubstract}
            >
                <AntDesign name="minuscircleo" size={14} color="black" />
            </Pressable>
            <Text className='px-2 text-sm'>{value }</Text>
            <Pressable
                disabled={disabled}
                onPress={onAdd}
            >
                <AntDesign name="pluscircleo" size={14} color="black" />
            </Pressable>
        </View>
    )
}