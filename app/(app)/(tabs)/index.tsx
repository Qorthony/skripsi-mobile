import FullWidthEventCard from '@/components/FullWidthEventCard';
import { Spinner } from '@/components/ui/spinner';
import { EVENTS_DATA } from '@/constants/events-data';
import { useSession } from '@/hooks/auth/ctx';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Event = {
  id: number;
  nama: string;
  lokasi: string;
  kota?: string;
  alamat_lengkap?: string;
  jadwal_mulai: string;
  jadwal_selesai: string;
  deskripsi?: string;
};

export default function HomeScreen() {
  const { signOut, session } = useSession();

  const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl + '/events?ongoing=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }

      const data = await res.json();
      setEvents(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  
  return (
    <View className='flex-1 bg-white'>
      {loading ? (
        <View className='flex-1 justify-center items-center'>
          <Spinner size='large' />
        </View>
      ) : (
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
            contentContainerStyle={{ paddingBottom: 100 }}
            data={events}
            ListEmptyComponent={() => (
              <View className='justify-center items-center p-8 mt-10'>
                <Text className='text-lg text-gray-500 text-center mb-3'>
                  Belum ada event yang tersedia saat ini
                </Text>
                <Text className='text-gray-400 text-center mb-5'>
                  Silakan coba lagi nanti atau tarik layar ke bawah untuk menyegarkan
                </Text>
                <Pressable 
                  className='bg-purple-600 py-3 px-6 rounded-lg'
                  onPress={onRefresh}
                >
                  <Text className='text-white font-medium'>Muat Ulang</Text>
                </Pressable>
              </View>
            )}
            renderItem={({ item }) => (
              <Pressable onPress={() => router.push(`/events/${item.id}`)}>
                <FullWidthEventCard
                  name={item.nama} 
                  date={item.jadwal_mulai} 
                  location={item.lokasi} 
                  city={item.kota} 
                  description={item.deskripsi || ''} 
                  image={EVENTS_DATA[0].image}
                />
              </Pressable>
            )}
            keyExtractor={item => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      )}
    </View>
  );
}