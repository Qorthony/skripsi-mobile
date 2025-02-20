import FullWidthEventCard from '@/components/FullWidthEventCard';
import { EVENTS_DATA } from '@/constants/events-data';
import { useSession } from '@/hooks/auth/ctx';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { signOut } = useSession();
  return (
    <View className='flex-1 bg-white'>
      <SafeAreaView className='px-2 mb-16'>
        <View className='py-4'>
          <Text
            onPress={() => {signOut()}}
            className='font-bold text-xl text-red-500 ms-auto me-0'
          >
            Logout
          </Text>
          <Text className='font-bold text-xl'>
            Events yang akan datang
          </Text>
        </View>
        <FlatList
          data={EVENTS_DATA}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/events/${item.id}`)}>
              <FullWidthEventCard {...item} />
            </Pressable>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </SafeAreaView>
    </View>
  );
}