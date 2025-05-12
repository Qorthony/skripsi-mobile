import { View, Text, ScrollView, Pressable} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CountdownTimer from '@/components/CountdownTimer'
import { Card } from '@/components/ui/card'
import AbsoluteBottomView from '@/components/AbsoluteBottomView'
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer'
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio'
import { ChevronDownIcon, CircleIcon, CloseIcon, EditIcon, Icon } from '@/components/ui/icon'
import { Divider } from '@/components/ui/divider'
import { router, useLocalSearchParams } from 'expo-router'
import { useSession } from '@/hooks/auth/ctx'
import dayjs from 'dayjs'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal'
import { Button, ButtonText } from '@/components/ui/button'
import { Input, InputField } from '@/components/ui/input'
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select'
import { VStack } from '@/components/ui/vstack'
import { z } from 'zod'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rupiahFormat } from '@/helpers/currency';
import { dateIdFormat } from '@/helpers/date';
import { Spinner } from '@/components/ui/spinner'

const ParticipantSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  email: z.string().email({message: 'Email tidak valid'}),
  ticket_id: z.string().uuid({message: 'Tiket tidak valid'}),
  pemesan: z.boolean()
})

type ParticipantType = z.infer<typeof ParticipantSchema>


export default function Transaction() {
  const { id } = useLocalSearchParams();

  const {session} = useSession();

  const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

  const [transaction, setTransaction] = useState<any>(null);

  const getTransaction = async () => {
    try {
      const res = await fetch(apiUrl+'/transactions/'+id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }

      let json = await res.json();
      setTransaction(json.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTransaction();
  }, [id]);

  useEffect(() => {
    if (transaction) {
      setParticipants(generateParticipantStructure())
    }
  }, [transaction]);


  const generateParticipantStructure = () => {
    let participantStructure = [];

    for (let i = 0; i < transaction?.jumlah_tiket; i++) {
      participantStructure.push({
        id: i+1,
        name: i==0?transaction?.user.name:'',
        email: i==0?transaction?.user.email:'',
        ticket_id: transaction?.jumlah_tiket===1?transaction?.transaction_items[0]?.ticket_issueds[0]?.id:'',
        pemesan: i === 0
      })
    }
    
    return participantStructure
  }
  
  const [participants, setParticipants] = useState <ParticipantType[] | null> (null)

  const [openPaymentOptions, setOpenPaymentOptions] = useState(false)

  const PAYMENT_OPTIONS = [
    {
      name: 'BRIVA',
      icon: 'bank-transfer',
      code: 'bri'
    },
    {
      name: 'BCA VA',
      icon: 'credit-card',
      code: 'bca'
    },
    {
      name: 'Gopay',
      icon: 'paypal',
      code: 'gopay'
    }
  ]

  const [selectedPayment, setSelectedPayment] = useState('')

  useEffect(() => {
    console.log(selectedPayment)
  }, [selectedPayment])

  const timeLeft = dayjs(transaction?.batas_waktu).diff(dayjs(), 'second')
  
  const eventLocation = transaction?.event?.lokasi === 'online' ? 'Online' : transaction?.event?.kota

  const paymentTotal = transaction?.transaction_items.reduce((acc: number, item: any) => acc + item.total_harga, 0) + 1000

  const [showModal, setShowModal] = useState(0);

  const [loading, setLoading] = useState(false);

  const postUpdateTransaction = async () => {
    try {
      setLoading(true);
      const data = {
        metode_pembayaran: selectedPayment,
        ticket_issueds: 
          participants?.map((participant) => {
            return {
              id: participant.ticket_id,
              email_penerima: participant.email,
              pemesan: participant.pemesan
            }
          })
      }

      console.log(data);
      

      const res = await fetch(apiUrl+'/transactions/'+id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
        body: JSON.stringify(data)
      });

      let json = await res.json();
      console.log(json);

      router.push(`/transactions/${id}/payment`)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      className='flex-1 bg-slate-100'
    >
      <ScrollView
        className='flex-1 mx-2 mb-16'
        showsVerticalScrollIndicator={false}
      >
        <Text className='mb-2'>Transaction Form Page</Text>
        <View className='flex-row mb-2 justify-between items-center p-2 bg-yellow-300 rounded-md'>
          <Text>Selesaikan transaksi sebelum </Text>
          {
            transaction?.batas_waktu && 
            <CountdownTimer
              initialSeconds={timeLeft}
              containerClassName='bg-white rounded-md px-2 py-1'
              textClassName='text-red-500'
            />
          }
        </View>

        <Card
          size='sm'
        >
          <Text className='font-bold text-lg'> {transaction?.event.nama} </Text>
          <View className='flex-row justify-between'>
            <View className='flex-row'>
              <Text className='text-sm text-gray-600'>{eventLocation} | </Text>
              <Text className='text-sm text-gray-600'>{dateIdFormat(transaction?.event?.jadwal_mulai)}</Text>
            </View>
          </View>
        </Card>

        <View className='mt-2'>
          <Card size='sm'>
            <Text className='text-lg font-bold mb-2'>Isi Data Peserta</Text>

            {
              participants?.map((participant, index) => (
                <View key={index} className='mb-2'>
                  <Text className='font-semibold mb-1'>Peserta {index+1} {index==0?"(Pemesan)":""} </Text>
                  <View>
                    {
                      participant?.email && 
                      <VStack className='mb-2'>
                        <Text className='text-gray-500'>Email</Text>
                        <Text>{participant?.email}</Text>
                      </VStack>
                    }
                    {
                      participant?.ticket_id && 
                      <VStack className='mb-2'>
                        <Text className='text-gray-500'>Kategori Tiket</Text>
                        <Text>
                          {
                            transaction?.transaction_items
                            .find((item: any) => item.ticket_issueds.find((ticket: any) => ticket.id === participant.ticket_id))
                            ?.nama
                          }
                        </Text>
                      </VStack>
                    }
                  </View>

                  <Button 
                    onPress={() =>{
                      setShowModal(participant.id)
                    }}
                    variant='outline'
                    action='primary'
                  >
                    {
                      participant?.email ?
                      <ButtonText>Ubah Data Peserta</ButtonText>:
                      <ButtonText>+ Isi Data Peserta</ButtonText>
                    }
                  </Button>
                </View>
              ))
            }

            {
              showModal !== 0 &&
              <FormModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                participants={participants}
                setParticipants={setParticipants}
                transactionItems={transaction?.transaction_items}
              />
            }

          </Card>
        </View>

        <Card
          size='sm'
          className='mt-2 mb-10'
        >
          <Text className='text-lg font-bold mb-2'>Ringkasan Pembayaran</Text>
          {
            transaction?.transaction_items.map((item: any, index: number) => (
              <View className='flex-row justify-between' key={index}>
                <View>
                  <Text className='text-sm'>{item.nama}</Text>
                  <Text className='text-gray-400'>{item.jumlah}x</Text>
                </View>
                <Text className='text-sm'>{rupiahFormat(item.total_harga)}</Text>
              </View>
            ))
          }
          <View className='flex-row justify-between'>
            <View>
              <Text className='text-sm'>Biaya Layanan</Text>
            </View>
            <Text className='text-sm'>Rp. 1.000</Text>
          </View>
          <Divider className='my-2' />
          <View className='flex-row justify-between'>
            <Text className='font-semibold'>Total Pembayaran</Text>
            <Text>{rupiahFormat(paymentTotal)}</Text>
          </View>
        </Card>

      </ScrollView>

      <AbsoluteBottomView>
        <View className='flex-row justify-between items-center'>
          <View>
            {
              selectedPayment === '' ?
              '':
              <Pressable className='flex-row items-center' onPress={() => setOpenPaymentOptions(true)} >
                <Text className='text-sm'>{PAYMENT_OPTIONS.find((value)=>value.code===selectedPayment)?.name} </Text>
                  <Icon as={EditIcon} size='sm'/>
              </Pressable>
            }
            <View className='flex-row'>
              <Text className='font-bold'>{rupiahFormat(paymentTotal)}</Text>
            </View>
          </View>
          {
            selectedPayment === '' ?
            <Pressable
              className='bg-purple-600 rounded-lg p-2 justify-center'
              onPress={() => setOpenPaymentOptions(true)}
            >
              <Text className='text-white text-center'>Pilih pembayaran</Text>
            </Pressable>
            :
            <Pressable
              className={`${loading ? 'bg-purple-400' : 'bg-purple-600'} rounded-lg p-2 justify-center`}
              onPress={postUpdateTransaction}
              disabled={loading}
            >
              {
                loading ?
                <Spinner size="small" color="white" /> :
                <Text className='text-white text-center'>Bayar Sekarang</Text>
              }
            </Pressable>
          }
        </View>
      </AbsoluteBottomView>
      
{/* Drawer for Payment Options */}
      <Drawer
        isOpen={openPaymentOptions}
        onClose={() => {
          setOpenPaymentOptions(false)
        }}
        size="full"
        anchor="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader className='border-b'>
            <Text className='text-xl py-2'>Metode Pembayaran</Text>
          </DrawerHeader>
          <DrawerBody>
            <RadioGroup 
              className='mb-2' 
              value={selectedPayment}
              onChange={(value) => {
                setSelectedPayment(value)
              }}
            >
            {
              PAYMENT_OPTIONS.map((option, index) => (
                  <Radio
                    key={index} 
                    value={option.code} 
                    size="lg" 
                    isInvalid={false} 
                    isDisabled={false}
                  >
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>{option.name}</RadioLabel>
                  </Radio>
              ))
            }
            </RadioGroup>
          </DrawerBody>
          <DrawerFooter>
            <Pressable
              onPress={() => {
                setOpenPaymentOptions(false)
              }}
              className="flex-1 bg-purple-600 rounded-lg p-2"
            >
              <Text className='text-white text-center'>Pilih</Text>
            </Pressable>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </SafeAreaView>
  )
}

// Form Modal
type FormModalProps = {
  participants: ParticipantType[] | null;
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantType[] | null>>;
  transactionItems: any;
  showModal: number;
  setShowModal: React.Dispatch<React.SetStateAction<number>>;
}


function FormModal({
  participants,
  setParticipants,
  transactionItems,
  showModal,
  setShowModal
}: FormModalProps ) 
{
  const participant = participants?.find((participant) => participant.id === showModal) || {id: showModal, name: '', email: '', ticket_id: '', pemesan: false}

  const [formData, setFormData] = useState<ParticipantType>(participant)

  const handleInputChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  let availableTickets: any[] = [];

  transactionItems?.forEach((item: any) => {
    item.ticket_issueds.forEach((ticket: any) => {
      availableTickets.push({
        label: item.nama,
        value: ticket.id,
        used: participants?.find((participant) => participant.ticket_id === ticket.id) ? true : false
      })
    })
  })

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ParticipantSchema),
    defaultValues:{
      id: showModal,
      email: participant.email,
      ticket_id: participant.ticket_id,
      pemesan: participant.pemesan
    }
  });

  const saveFormModal = (data:ParticipantType) => {
    console.log(data);

    // console.log(parseResult.data);
      
    setParticipants(prev => {
      if (!prev) return null;
      return prev.map((participant) => {
        if (participant.id === showModal) {
          return {
            ...data,
          };
        }
        return participant;
      });
    });

    setShowModal(0);
    
  }

  

  
  

  return (
    <View>
      <Modal
        isOpen={showModal!==0}
        onClose={() => {
          setShowModal(0)
        }}
        size="full"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-2xl font-semibold">
              Peserta {participant?.id} {participant?.pemesan?"(Pemesan)":""} 
            </Text>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
              <View className='w-10/12'>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className='mb-2'
                      variant='underlined'
                      size='sm'
                      isDisabled={participant?.pemesan}
                    >
                      <InputField 
                        placeholder='Email'
                        onBlur={onBlur} 
                        onChangeText={onChange}
                        value={value}
                      />
                    </Input>
                  )}
                />
                {errors.email && <Text className='text-red-600'>{errors.email.message}</Text>}

                {/* <Input
                    className='mb-2'
                    variant='underlined'
                    size='sm'
                >
                    <InputField 
                      placeholder='Email' 
                      onChangeText={(text)=>handleInputChange('email',text)}
                      value={formData.email}
                    />
                </Input> */}

                <Controller
                  control={control}
                  name="ticket_id"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select 
                      className='mb-2'
                      defaultValue={availableTickets.find((ticket) => ticket.value === value)?.label}
                      initialLabel={availableTickets.find((ticket) => ticket.value === value)?.label} 
                      onValueChange={(value) => onChange(value)}
                    >
                        <SelectTrigger className='w-full items-center flex-row justify-between' variant="underlined" size="sm">
                            <SelectInput
                              className='m-0 p-0' 
                              placeholder="Pilih Tiket" 
                            />
                            <SelectIcon className="me-3" as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                {
                                  availableTickets.map((ticket, index) => (
                                    <SelectItem
                                      className={ticket?.used?'text-white bg-slate-200':''} 
                                      key={index} 
                                      label={ticket.label} 
                                      value={ticket.value}
                                      isDisabled={ticket.used} 
                                    />
                                  ))
                                }
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                  )}
                />

                {/* <Select 
                  className='mb-2'
                  defaultValue={availableTickets.find((ticket) => ticket.value === formData.ticket_id)?.label}
                  initialLabel={availableTickets.find((ticket) => ticket.value === formData.ticket_id)?.label} 
                  onValueChange={(value) => handleInputChange('ticket_id', value)}
                >
                    <SelectTrigger className='w-full items-center flex-row justify-between' variant="underlined" size="sm">
                        <SelectInput
                          className='m-0 p-0' 
                          placeholder="Pilih Tiket" 
                        />
                        <SelectIcon className="me-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {
                              availableTickets.map((ticket, index) => (
                                <SelectItem
                                  className={ticket?.used?'text-white bg-slate-200':''} 
                                  key={index} 
                                  label={ticket.label} 
                                  value={ticket.value}
                                  isDisabled={ticket.used} 
                                />
                              ))
                            }
                        </SelectContent>
                    </SelectPortal>
                </Select> */}
                {errors.ticket_id && <Text className='text-red-600'>{errors.ticket_id.message}</Text>}
                {errors.pemesan && <Text className='text-red-600'>{errors.pemesan.message}</Text>}
                {errors.id && <Text className='text-red-600'>{errors.id.message}</Text>}
                {errors.name && <Text className='text-red-600'>{errors.name.message}</Text>}
            </View>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(0)
              }}
            >
              <ButtonText>Batal</ButtonText>
            </Button>
            <Button
              onPress={handleSubmit(saveFormModal)}
            >
              <ButtonText>Selesai</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  )
}