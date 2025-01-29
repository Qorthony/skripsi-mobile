import { View } from 'react-native'
import React from 'react'

export default function AbsoluteBottomView({children}: {children: React.ReactNode}) {
  return (
    <View className='absolute bottom-0 left-0 right-0 border-t border-gray-400/20 p-4 bg-white'>
      {children}
    </View>
  )
}