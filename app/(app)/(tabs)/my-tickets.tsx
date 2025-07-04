import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, { act, useEffect, useState, createContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { MY_TICKETS_DUMMY } from '@/constants/my-tickets-dummy'
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge'
import { CheckIcon, GlobeIcon, InfoIcon } from '@/components/ui/icon'
import { VStack } from '@/components/ui/vstack'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet"
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Divider } from '@/components/ui/divider'
import { Input, InputField } from '@/components/ui/input'
import { useSession } from '@/hooks/auth/ctx'
import { dateIdFormat } from '@/helpers/date';
import { router } from 'expo-router'
import { useForm, Controller } from 'react-hook-form';
import { Spinner } from '@/components/ui/spinner';
import { rupiahFormat } from '@/helpers/currency';
import BackendRequest from '@/services/Request'
import * as SecureStore from 'expo-secure-store';

// Membuat context untuk sharing fungsi refresh
const TicketsContext = createContext<{
  refreshTickets: () => Promise<any[]>;
}>({
  refreshTickets: async () => [],
});

const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function MyTickets() {
  const { session } = useSession();

  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Ambil tiket dari SecureStore saat komponen mount
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const stored = await SecureStore.getItemAsync('myTickets');
        if (stored) setMyTickets(JSON.parse(stored));
      } catch (e) {
        console.error('Gagal load tiket dari SecureStore', e);
      }
      getMyTickets();
    };
    loadTickets();
  }, []);

  const getMyTickets = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(apiUrl + '/ticket-issued', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
      });

      if (!res.ok) {
        setRefreshing(false);
        throw new Error(`Response status: ${res.status}`);
      }

      let json = await res.json();

      setMyTickets(json.data);
      // Simpan data tiket ke SecureStore
      await SecureStore.setItemAsync('myTickets', JSON.stringify(json.data));
      setRefreshing(false);
      return json.data;
    } catch (error) {
      console.error(error);
      setRefreshing(false);
      return [];
    }
  };

  const onRefresh = async () => {
    await getMyTickets();
  };

  // useEffect(() => {
  //   getMyTickets();
  // }, []);

  if (refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <Spinner size="large" />
      </View>
    );
  }

  // Menyediakan context value berupa fungsi getMyTickets untuk children
  const contextValue = {
    refreshTickets: getMyTickets
  };

  return (
    <TicketsContext.Provider value={contextValue}>
      <SafeAreaView className='flex-1 bg-slate-100'>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View className='mx-2'>
            <Text className='font-bold mb-2 text-2xl'>My Tickets</Text>
            {
              myTickets.length === 0 ? (
                <Card className='mt-2 h-96 justify-center items-center'>
                  <Text className='text-center text-xl font-semibold'>Belum ada tiket</Text>
                </Card>
              ) :
                myTickets.map((ticket, i) => (
                  <TouchableOpacity
                    key={ticket.id}
                    onPress={() => router.push(`/tickets/${ticket.id}`)}
                  >
                    <TicketCard key={i} ticket={ticket} />
                  </TouchableOpacity>
                ))
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </TicketsContext.Provider>
  );
}

type BadgeAttributes = {
  [key: string]: {
    icon: React.ComponentType<any>;
    color: "muted" | "success" | "warning" | "info" | "error";
  };
}

function TicketCard({ ticket }: any) {
  const [showActionsheet, setShowActionsheet] = useState(false)
  const [showDrawer, setShowDrawer] = React.useState(false)

  const handleClose = () => setShowActionsheet(false)

  const handleOpenDrawer = () => {
    setShowActionsheet(false)
    setShowDrawer(true)
  }

  const event = ticket?.transaction_item?.transaction?.event
  const transactionItem = ticket?.transaction_item

  const badgeAttributes: BadgeAttributes = {
    'inactive': {
      icon: GlobeIcon,
      color: 'muted',
    },
    'active': {
      icon: CheckIcon,
      color: 'success',
    },
    'resale': {
      icon: InfoIcon,
      color: 'warning',
    },
    'checkin': {
      icon: CheckIcon,
      color: 'info',
    },
    'sold': {
      icon: CheckIcon,
      color: 'error',
    },
  }

  return (
    <Card className='mb-2'>
      <HStack>
        <Image
          source={require('@/assets/images/dummy_poster.png')}
          className='w-20 h-20 rounded-lg me-2'
        />
        <View className='flex-1'>
          <Text className='text-lg font-bold'>{event?.nama}</Text>
          <Text className='font-semibold text-purple-400'>{transactionItem?.nama}</Text>
          <Text className='text-sm text-gray-600'>
            {dateIdFormat(event?.jadwal_mulai)}
          </Text>
          <Text className='text-sm text-gray-600'>
            {
              event?.lokasi === 'online' ?
                "Online" :
                event?.kota
            }
          </Text>
        </View>
        <View>
          <Badge size="md" variant="solid" action={badgeAttributes[ticket.status].color}>
            <BadgeText>{ticket.status}</BadgeText>
            {/* <BadgeIcon as={badgeAttributes[ticket.status].icon} className="ml-2" /> */}
          </Badge>
        </View>
      </HStack>
      <VStack>
        <TicketCardMainButton ticket={ticket} />
        {
          ticket.status !== 'sold' || ticket.status !== 'checkin' ? 
          (
          <Button onPress={() => setShowActionsheet(true)}>
            <ButtonText>Lainnya</ButtonText>
          </Button>
          ):""

        }

        <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ActionsheetItem onPress={handleClose}>
              <ActionsheetItemText>Lihat Tiket</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={handleOpenDrawer}>
              <ActionsheetItemText>Jual Tiket</ActionsheetItemText>
            </ActionsheetItem>
          </ActionsheetContent>
        </Actionsheet>

        <ResaleDrawer
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          ticket={ticket}
        />

      </VStack>
    </Card>
  )
}

function TicketCardMainButton({ ticket }: any) {
  const { session } = useSession();

  const [loading, setLoading] = useState(false);

  // Menggunakan useContext untuk mendapatkan fungsi refresh dari komponen parent
  const { refreshTickets } = React.useContext(TicketsContext);

  const resale = ticket?.resale

  const cancelResale = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/resales/${resale?.id}?action=cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }

      let json = await res.json();
      
      // Setelah berhasil membatalkan resale, refresh daftar tiket
      refreshTickets();
      
      return json;
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);    
    }
  }

  const ActivateTicket = async (ticketIssuedId: string) => {
    BackendRequest({
      endpoint: `/ticket-issued/${ticketIssuedId}`,
      method: 'PATCH',
      token: session,
      onStart: () => {
        console.log('Activate Ticket:', ticket.id);
        setLoading(true);
      },
      onSuccess: async (data) => {
        console.log('Ticket activated successfully:', data);
        refreshTickets();
        // Fetch ticket detail dan simpan kode tiket ke SecureStore
        try {
          const res = await fetch(`${apiUrl}/ticket-issued/${ticketIssuedId}/checkin`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${session}`,
            },
          });
          if (res.ok) {
            const json = await res.json();
            const kodeTiket = json.data?.kode_tiket || '';
            await SecureStore.setItemAsync(`ticketCode_${ticketIssuedId}`, kodeTiket);
          }
        } catch (e) {
          console.error('Gagal fetch/simpan kode tiket setelah aktivasi', e);
        }
      },
      onError: (error) => {
        console.error('Error activating ticket:', error);
      },
      onComplete: () => {
        setLoading(false);
      }
    });
  }

  let buttonText = 'Check-In'
  let buttonAction = () => router.push(`/checkin/${ticket.id}`)

  if (ticket.status === 'resale') {
    buttonText = 'Batalkan Jual'
    buttonAction = () => cancelResale()
  } else if (ticket.status === 'sold') {
    buttonText = 'Tiket Terjual'
    // buttonAction = () => router.push(`/resale/${ticket.id}`)
  }
  else if (ticket.status === 'checkin') {
    buttonText = 'Tiket Sudah Diperiksa'
    buttonAction = () => {}
  }
  else if (ticket.status === 'inactive') {
    buttonText = 'Aktifkan Tiket'
    buttonAction = () => ActivateTicket(ticket.id)
  }
  else if (ticket.status === 'active') {
    buttonText = 'Check-in'
    buttonAction = () => router.push(`/checkin/${ticket.id}`)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className='mt-2 mb-2'
      onPress={buttonAction}
      disabled={loading}
    >
      <ButtonText>
        {loading ? (
          <Spinner color="gray.500" />
        ) : ""}
        {buttonText}
      </ButtonText>
    </Button>
  )
}

type ResaleDrawerProps = {
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  ticket: any;
}

function ResaleDrawer({
  showDrawer,
  setShowDrawer,
  ticket
}: ResaleDrawerProps) {
  const { session } = useSession();
  const { refreshTickets } = React.useContext(TicketsContext);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      hargaJual: ''
    }
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const addToResale = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await fetch(apiUrl + '/ticket-issued/'+ticket?.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
        body: JSON.stringify({
          action: 'resale',
          harga_jual: data.hargaJual,
        }),
      });

      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }

      let json = await res.json();

      // Setelah operasi resale berhasil, refresh daftar tiket
      setShowDrawer(false);
      refreshTickets();
      return json.data;
    }
    catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    addToResale(data);
  };

  const handleClose = () => setShowDrawer(false);

  const transactionItem = ticket?.transaction_item

  const minPrice = transactionItem?.harga_satuan - (transactionItem?.harga_satuan * 10 / 100);
  const maxPrice = transactionItem?.harga_satuan + (transactionItem?.harga_satuan * 10 / 100);

  return (
    <Drawer
      isOpen={showDrawer}
      onClose={handleClose}
      size='lg'
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <Text className='font-bold text-2xl'>Jual Tiket</Text>
        </DrawerHeader>
        <DrawerBody>
          <View>
            <Text className='font-bold text-purple-400'>Ticket : {transactionItem?.nama}</Text>
            <Text className='font-semibold'>Event : {transactionItem?.transaction.event.nama}</Text>
          </View>
          <Divider className='my-2' />
          <HStack className='justify-between mb-2'>
            <Text>Harga Official</Text>
            <Text>{rupiahFormat(transactionItem?.harga_satuan)}</Text>
          </HStack>
          <HStack className='justify-between mb-2'>
            <Text>Batas Min</Text>
            <Text>{rupiahFormat(minPrice)}</Text>
          </HStack>
          <HStack className='justify-between mb-2'>
            <Text>Batas Max</Text>
            <Text>{rupiahFormat(maxPrice)}</Text>
          </HStack>
          <Divider className='my-2' />
          <VStack className='justify-between mb-2'>
            <Text className='font-semibold mb-2'>Harga Jual</Text>
            <Controller
              name="hargaJual"
              control={control}
              rules={{
                required: 'Harga Jual is required',
                validate: {
                  isNumber: value => !isNaN(Number(value)) || 'Harga Jual harus berupa angka',
                  withinRange: value => (Number(value) >= minPrice && Number(value) <= maxPrice) || `Harga Jual harus antara ${rupiahFormat(minPrice)} dan ${rupiahFormat(maxPrice)}`
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="outline"
                  size="sm"
                  isInvalid={!!errors.hargaJual}
                >
                  <InputField
                    placeholder="Rp. ..."
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              )}
            />
            {errors.hargaJual && <Text className="text-red-500">{errors.hargaJual.message}</Text>}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            onPress={handleSubmit(onSubmit)}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner color="gray.500" />
            ) : (
              <ButtonText>Proses</ButtonText>
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}