import { View, Text } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';

const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const CountdownTimer = ({ 
    initialSeconds,
    containerClassName,
    textClassName 
}: { 
    initialSeconds: number;
    containerClassName?: string;
    textClassName?: string; 
}) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds > 0) {
            const timerId = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [seconds]);

    return (
        <View className={containerClassName}>
            <Text className={textClassName}>{formatTime(seconds)} remaining</Text>
        </View>
    );
};

export default CountdownTimer;