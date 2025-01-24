import FullWidthEventCard from '@/components/FullWidthEventCard';
import { EVENTS_DATA } from '@/constants/events-data';
import { ScrollView, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <View className='flex-1 bg-white'>
      <SafeAreaView className='px-2'>
        <View className='py-4'>
          <Text className='font-bold text-xl'>
            Events yang akan datang
          </Text>
        </View>
        <ScrollView>
          <View className='flex-1'>
            {EVENTS_DATA.map((event) => (
              <FullWidthEventCard 
                key={event.id} 
                {...event}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}