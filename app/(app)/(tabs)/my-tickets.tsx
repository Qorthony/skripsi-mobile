import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
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
import { Link, router } from 'expo-router'

export default function MyTickets() {
  const [showActionsheet, setShowActionsheet] = useState(false)
  const [showDrawer, setShowDrawer] = React.useState(false)
  const handleClose = () => setShowActionsheet(false)
  const handleOpenDrawer = () => {
    setShowActionsheet(false)
    setShowDrawer(true)
  }

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
      <ScrollView>
        <View className='mx-2'>
          <Text className='mb-2'>MyTickets</Text>
          {
            MY_TICKETS_DUMMY.map((ticket, i) => (
              <Card key={i} className='mb-2'>
                <HStack>
                  <Image
                    source={require('@/assets/images/dummy_poster.png')}
                    className='w-20 h-20 rounded-lg me-2'
                  />
                  <View className='flex-1'>
                    <Text className='text-lg font-bold'>{ticket.event}</Text>
                    <Text className='font-semibold text-purple-400'>{ticket.ticket_type}</Text>
                    <Text className='text-sm text-gray-600'>{ticket.date}</Text>
                    <Text className='text-sm text-gray-600'>{ticket.location}</Text>
                  </View>
                  <View>
                    <Badge size="md" variant="solid" action="success">
                      <BadgeText>{ticket.status}</BadgeText>
                      <BadgeIcon as={CheckIcon} className="ml-2" />
                    </Badge>
                  </View>
                </HStack>
                <VStack>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className='mt-2 mb-2'
                      onPress={() => router.push('/checkin/'+ticket.id)}
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
                  <Drawer
                    isOpen={showDrawer}
                    onClose={() => {
                      setShowDrawer(false)
                    }}
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
                          <Text className='font-bold text-purple-400'>Ticket : {ticket.ticket_type}</Text>
                          <Text className='font-semibold'>Event : {ticket.event}</Text>
                        </View>
                        <Divider className='my-2' />
                        <HStack className='justify-between mb-2'>
                          <Text>Harga Official</Text>
                          <Text>Rp. 150000</Text>
                        </HStack>
                        <HStack className='justify-between mb-2'>
                          <Text>Batas Min</Text>
                          <Text>Rp. 150000</Text>
                        </HStack>
                        <HStack className='justify-between mb-2'>
                          <Text>Batas Max</Text>
                          <Text>Rp. 150000</Text>
                        </HStack>
                        <Divider className='my-2' />
                        <VStack className='justify-between mb-2'>
                          <Text className='font-semibold mb-2'>Harga Jual</Text>
                          <Input
                            variant="outline"
                            size="sm"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                          >
                            <InputField placeholder="Rp. ..." />
                          </Input>
                        </VStack>
                      </DrawerBody>
                      <DrawerFooter>
                        <Button
                          onPress={() => {
                            setShowDrawer(false)
                          }}
                          className="flex-1"
                        >
                          <ButtonText>Proses</ButtonText>
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </VStack>
              </Card>
            ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}