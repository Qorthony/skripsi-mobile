import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, { act, useEffect, useState } from 'react'
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

const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function MyTickets() {
  const { session } = useSession();

  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getMyTickets = async () => {
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
        throw new Error(`Response status: ${res.status}`);
      }

      let json = await res.json();
      console.log(json.data[0]);

      setMyTickets(json.data);
      return json.data;
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getMyTickets();
    setRefreshing(false);
  };

  useEffect(() => {
    getMyTickets();
  }, []);

  return (
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
            <BadgeIcon as={badgeAttributes[ticket.status].icon} className="ml-2" />
          </Badge>
        </View>
      </HStack>
      <VStack>
        <Button
          variant="outline"
          size="sm"
          className='mt-2 mb-2'
          onPress={() => router.push(`/checkin/${ticket.id}`)}
        >
          <ButtonText>Check-In</ButtonText>
        </Button>
        <Button onPress={() => setShowActionsheet(true)}>
          <ButtonText>Lainnya</ButtonText>
        </Button>

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
      console.log(json.data);

      setShowDrawer(false);
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