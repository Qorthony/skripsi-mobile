import { View, Text, SafeAreaView, Image, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { DUMMY_POSTER, EVENTS_DATA } from '@/constants/events-data';
import { dateIdFormat } from '@/helpers/date';
import CounterButton from '@/components/CounterButton';
import AbsoluteBottomView from '@/components/AbsoluteBottomView';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { ChevronRightIcon } from '@/components/ui/icon';
import { useSession } from '@/hooks/auth/ctx';
import { rupiahFormat } from '@/helpers/currency';
import { Spinner } from '@/components/ui/spinner';
import dayjs from 'dayjs';
import { date } from 'zod';

type selectedTicket = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

type EventType = {
    nama: string;
    jadwal_mulai: string;
    location: string;
    kota?: string;
    description?: string;
    tickets: TicketTypes[];
}

interface TicketTypes {
    id: number;
    nama: string;
    harga: number;
    keterangan: string;
    waktu_buka?: string;
    waktu_tutup: string;
}

export default function DetailEvent() {
    const { id } = useLocalSearchParams();

    const {session} = useSession();

    const [event, setEvent] = useState<EventType | null>(null);
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const res = await fetch(apiUrl+'/events/'+id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
            }

            const json = await res.json();
            
            setEvent(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvent();
    }, []);

    const [activeTab, setActiveTab] = useState('deskripsi');
    const activeTabClassName = 'border-b-2 border-purple-600';

    const [selected, setSelected] = useState<selectedTicket[]>([]);

    useEffect(() => {
        console.log(id);
    }, [id]);

    const total = selected.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleBuyTicket = async () => {
        setIsProcessing(true);
        try {
            console.log(selected);
            console.log(apiUrl+'/transactions');

            const res = await fetch(apiUrl+'/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`,
                },
                body: JSON.stringify({
                    event_id: id,
                    selected_ticket: selected,
                }),
            });

            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
            }

            const json = await res.json();
            console.log("transaction id after detail event : "+json.data.id);

            router.push(`/transactions/${json.data.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    }

    const isDisabled = selected.length === 0;

    return (
        <SafeAreaView className='flex-1 bg-white'>
            {loading ? (
                <View className='flex-1 justify-center items-center'>
                    <Spinner />
                </View>
            ) : (
                <View className='flex-1 bg-white'>
                    <Image
                        source={DUMMY_POSTER}
                        className='w-full h-48 rounded-lg'
                    />
                    <View className='px-4 py-2'>
                        <Text className='text-xl font-bold'>{event?.nama}</Text>
                        <Text className='text-sm text-gray-600'>{event? dateIdFormat(event?.jadwal_mulai):''}</Text>
                        {
                            event?.location === 'online' ?
                                <Text className='text-sm text-gray-600'>{event?.location}</Text> :
                                <Text className='text-sm text-gray-600'>{event?.kota}</Text>
                        }
                    </View>
                    
                    <View className='flex-row justify-end px-4 pb-2'>
                        <Button size="sm" variant="link" action="primary" onPress={() => router.push(`/events/${id}/secondary-tickets`)}>
                            <ButtonText>Secondary Ticket</ButtonText>
                            {/* <ButtonIcon as={ChevronRightIcon} /> */}
                        </Button>
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
                                <Text>{event?.description}</Text> 
                                :<FlatList
                                    className='mb-16'
                                    showsVerticalScrollIndicator={false}
                                    data={event?.tickets}
                                    renderItem={({ item }) => (
                                        <TicketCard
                                            selected={selected}
                                            setSelected={setSelected} 
                                            id={item.id}
                                            type={item.nama}
                                            price={item.harga}
                                            description={item.keterangan}
                                            date_open={item?.waktu_buka}
                                            date_close={item?.waktu_tutup}
                                        />
                                    )}
                                    keyExtractor={item => item.id.toString()}
                                />
                        }
                    </View>

                    <AbsoluteBottomView>
                        <View className='flex-row justify-between'>
                            <Text>Total</Text>
                            <Text>{rupiahFormat(total)}</Text>
                        </View>
                        <Pressable 
                            className={`bg-purple-600 rounded-lg p-2 ${isDisabled || isProcessing ? 'opacity-50' : ''}`}
                            onPress={handleBuyTicket}
                            disabled={isDisabled || isProcessing}
                        >
                            {isProcessing ? (
                                <Spinner />
                            ) : (
                                <Text className='text-white text-center'>Beli Tiket</Text>
                            )}
                        </Pressable>
                    </AbsoluteBottomView>
                </View>
            )}
        </SafeAreaView>
    )
}

interface TicketCardProps {
    id: number;
    type: string;
    price: number;
    description: string;
    date_open?: string;
    date_close: string;
    selected: selectedTicket[];
    setSelected: (value: any) => void;
}

function TicketCard({
    id, 
    type, 
    price, 
    description,
    date_open,
    date_close,
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

    const isComingSoon = () : boolean => dayjs(date_open).isAfter(dayjs()) || dayjs(date_open).isSame(dayjs());
    const isOver = () : boolean => dayjs(date_close).isBefore(dayjs()) || dayjs(date_close).isSame(dayjs());
    
    return (
        <View className='bg-slate-200 rounded-lg p-2 my-2'>
            <View>
                <Text className='font-bold'>{type}</Text>
                <Text className='text-sm'>{rupiahFormat(price)}</Text>
                {description && <Text className='text-sm text-gray-600'>{description}</Text>}
                {isComingSoon() && <Text className='text-sm text-red-500'>Belum buka</Text>}
                {isOver() && <Text className='text-sm text-red-500'>Tutup</Text>}
                {
                    !isComingSoon() && !isOver() ? (
                        <View className='items-end'>
                            <CounterButton
                                onSubstract={handleSubstract}
                                onAdd={handleAdd}
                                value={selected.find((item: any) => item.id === id)?.quantity || 0}
                                disabled={isComingSoon() || isOver()}
                            />
                        </View>
                    ) : null
                }
            </View>
        </View>
    )
}