import { View, Text, SafeAreaView, Image, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { EVENTS_DATA, TicketTypes } from '@/constants/events-data';
import dayjs from 'dayjs';
import CounterButton from '@/components/CounterButton';
import AbsoluteBottomView from '@/components/AbsoluteBottomView';

type selectedTicket = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export default function DetailEvent() {
    const { id } = useLocalSearchParams();
    const EVENTS_DETAIL = EVENTS_DATA.find(event => event.id === Number(id));

    const [activeTab, setActiveTab] = useState('deskripsi');
    const activeTabClassName = 'border-b-2 border-purple-600';

    const [selected, setSelected] = useState<selectedTicket[]>([]);

    useEffect(() => {
        console.log(id);
    }, [id]);



    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='flex-1 bg-white'>
                <Image
                    source={EVENTS_DETAIL?.image}
                    className='w-full h-48 rounded-lg'
                />
                <View className='px-4 py-2'>
                    <Text className='text-xl font-bold'>{EVENTS_DETAIL?.name}</Text>
                    <Text className='text-sm text-gray-600'>{dayjs(EVENTS_DETAIL?.date).format('DD MMMM YYYY')}</Text>
                    {
                        EVENTS_DETAIL?.location === 'online' ?
                            <Text className='text-sm text-gray-600'>{EVENTS_DETAIL?.location}</Text> :
                            <Text className='text-sm text-gray-600'>{EVENTS_DETAIL?.city}</Text>
                    }
                </View>

                <View className='bg-gray-100 d-flex justify-around flex-row'>
                    <Pressable
                        className={`flex-grow py-3 ${activeTab === 'deskripsi' ? activeTabClassName : ''}`}
                        onPress={() => setActiveTab('deskripsi')}
                    >
                        <Text className='text-center'>Deskripsi</Text>
                    </Pressable>
                    <Pressable
                        className={`flex-grow py-3 ${activeTab === 'tiket' ? activeTabClassName : ''}`}
                        onPress={() => setActiveTab('tiket')}
                    >
                        <Text className='text-center'>Tiket</Text>
                    </Pressable>
                </View>
                <View className='flex-1 p-4'>
                    {
                        activeTab === 'deskripsi' ?
                            <Text>{EVENTS_DETAIL?.description}</Text> :
                            <FlatList
                                className='mb-16'
                                showsVerticalScrollIndicator={false}
                                data={EVENTS_DETAIL?.tickets}
                                renderItem={({ item }) => (
                                    <TicketCard
                                        selected={selected}
                                        setSelected={setSelected} 
                                        {...item} 
                                    />
                                )}
                                keyExtractor={item => item.id.toString()}
                            />
                    }
                </View>

                <AbsoluteBottomView>
                    <View className='flex-row justify-between'>
                        <Text>Total</Text>
                        <Text>Rp. {selected.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)}</Text>
                    </View>
                    <Pressable 
                        className='bg-purple-600 rounded-lg p-2'
                        onPress={() => router.push('/transactions')}
                    >
                        <Text className='text-white text-center'>Beli Tiket</Text>
                    </Pressable>
                </AbsoluteBottomView>
            </View>
        </SafeAreaView>
    )
}

interface TicketCardProps {
    id: number;
    type: string;
    price: number;
    description: string;
    selected: selectedTicket[];
    setSelected: (value: any) => void;
}

function TicketCard({
    id, 
    type, 
    price, 
    description,
    selected,
    setSelected
}: TicketCardProps) {

    const handleSubstract = () => {
        // jika quantity 1, maka hapus item dari selected. jika tidak, kurangi quantity
        if (selected.find((item: any) => item.id === id)?.quantity === 1) {
            setSelected(selected.filter((item: any) => item.id !== id));
            return;
        }
        setSelected(selected.map((item: any) => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity - 1 }
            }
            return item;
        }));
    }

    const handleAdd = () => {
        if (selected.find((item: any) => item.id === id)) {
            setSelected(selected.map((item: any) => {
                if (item.id === id) {
                    return { ...item, quantity: item.quantity + 1 }
                }
                return item;
            }));
            return;
        }
        setSelected([...selected, { id, name: type, price, quantity: 1 }]);
    }
    
    return (
        <View className='bg-slate-200 rounded-lg p-2 my-2'>
            <View>
                <Text className='font-bold'>{type}</Text>
                <Text className='text-sm'>Rp. {price}</Text>
                <Text className='text-sm text-gray-600'>{description}</Text>
                <View className='items-end'>
                    <CounterButton
                        onSubstract={handleSubstract}
                        onAdd={handleAdd}
                        value={selected.find((item: any) => item.id === id)?.quantity || 0}
                    />
                </View>
            </View>
        </View>
    )
}