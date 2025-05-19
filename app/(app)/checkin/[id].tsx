import { View, Text, Alert, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { EyeIcon, Icon, CheckCircleIcon } from '@/components/ui/icon'
import { Card } from '@/components/ui/card'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { useSession } from '@/hooks/auth/ctx'
import NfcManager, { NfcEvents, NfcTech, Ndef } from 'react-native-nfc-manager'
import { Button, ButtonText } from '@/components/ui/button'
import BackendRequest from '@/services/Request'
import { HCESession, NFCTagType4NDEFContentType, NFCTagType4 } from 'react-native-hce'

export default function Checkin() {
    const { id } = useLocalSearchParams()
    const { session } = useSession()
    
    const [ticket, setTicket] = useState<any>(null)
    const [ticketCode, setTicketCode] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [nfcSupported, setNfcSupported] = useState<boolean>(false)
    const [nfcEnabled, setNfcEnabled] = useState<boolean>(false)
    const [nfcWriting, setNfcWriting] = useState<boolean>(false)
    const [nfcSuccess, setNfcSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [hceEnabled, setHceEnabled] = useState<boolean>(false)
    const [hceActive, setHceActive] = useState<boolean>(false)

    // Inisialisasi NFC
    useEffect(() => {
        const initNfc = async () => {
            try {
                // Periksa apakah NFC didukung oleh perangkat
                const supported = await NfcManager.isSupported()
                setNfcSupported(supported)
                
                if (supported) {
                    await NfcManager.start()
                    const enabled = await NfcManager.isEnabled()
                    setNfcEnabled(enabled)
                    
                    // Jika NFC tidak diaktifkan, tampilkan peringatan
                    if (!enabled) {
                        Alert.alert(
                            'NFC Tidak Aktif',
                            'Silakan aktifkan NFC di pengaturan perangkat Anda terlebih dahulu.',
                            [{ text: 'OK' }]
                        )
                    }
                }
            } catch (ex) {
                console.warn('Error initializing NFC', ex)
                setError('Gagal menginisialisasi NFC')
            }
        }
        
        initNfc()
        
        // Cleanup function
        return () => {
            const cleanUp = async () => {
                try {
                    await NfcManager.cancelTechnologyRequest()
                } catch (ex) {
                    console.log('Error cancelling NFC tech', ex)
                }
            }
            cleanUp()
        }
    }, [])    
    
    // Ambil data tiket dari API menggunakan BackendRequest    
    useEffect(() => {
        const fetchTicket = async () => {
            if (id && session) {
                await BackendRequest({
                    endpoint: `/ticket-issued/${id}/checkin`,
                    method: 'GET',
                    token: session,
                    onStart: () => {
                        setLoading(true)
                    },
                    onSuccess: (data: any) => {
                        setTicket(data.data)
                        setTicketCode(data.data?.kode_tiket || null)
                        console.log('Ticket data fetched:', data.data)
                    },
                    onError: (error: any) => {
                        console.error('Error fetching ticket:', error)
                        setError('Gagal memuat data tiket')
                    },
                    onComplete: () => {
                        setLoading(false)
                    }
                })
            }
        }    
        fetchTicket()    
    }, [id, session])

    // Card Emulation: Emulate device as NFC tag with ticket code (Android only)
    useEffect(() => {
        if (Platform.OS !== 'android' || !ticketCode || !hceEnabled) return;
        let session: HCESession | undefined;
        let removeListener: (() => void) | undefined;
        setHceActive(true)
        const startHce = async () => {
            try {
                const tag = new NFCTagType4({
                    type: NFCTagType4NDEFContentType.Text,
                    content: `TICKET:${ticketCode}`,
                    writable: false,
                });
                session = await HCESession.getInstance();
                await session.setApplication(tag);
                await session.setEnabled(true);
                removeListener = session.on(
                    HCESession.Events.HCE_STATE_READ,
                    () => {
                        console.log('HCE state read');
                        
                        // Optionally show a toast or update state
                    }
                );
            } catch (e) {
                console.warn('HCE error:', e);
            }
        };
        startHce();
        return () => {
            setHceActive(false)
            if (session) session.setEnabled(false);
            if (removeListener) removeListener();
        };
    }, [ticketCode, hceEnabled])

    // Fungsi untuk menulis kode tiket ke NFC tag
    const writeNfc = async () => {
        if (!ticketCode) {
            Alert.alert('Kode Tiket Tidak Tersedia', 'Tidak dapat memulai NFC tanpa kode tiket yang valid')
            return
        }
        
        try {
            setNfcWriting(true)
            setNfcSuccess(false)
            
            // Request NFC technology
            await NfcManager.requestTechnology(NfcTech.Ndef)
            
            // Buat NDEF message dengan kode tiket
            const bytes = Ndef.encodeMessage([
                Ndef.textRecord(`TICKET:${ticketCode}`),
            ])
            
            if (bytes) {
                await NfcManager.ndefHandler.writeNdefMessage(bytes)
                setNfcSuccess(true)
                Alert.alert('Berhasil!', 'Kode tiket telah berhasil ditulis ke tag NFC')
            }
        } catch (ex) {
            console.warn('Error writing to NFC', ex)
            // Jika error bukan karena user cancel
            if ((ex as Error).toString() !== 'User cancelled the request') {
                Alert.alert('Gagal Menulis NFC', 'Terjadi kesalahan saat menulis data ke tag NFC. Coba tempelkan lagi atau gunakan tag yang berbeda.')
            }
        } finally {
            // Cancel NFC technology request
            setNfcWriting(false)
            NfcManager.cancelTechnologyRequest()
        }
    }
    
    // Batalkan dan kembali ke halaman sebelumnya
    const handleCancel = () => {
        router.back()
    }

    if (loading) {
        return (
            <SafeAreaView className='flex-1 bg-slate-100 justify-center items-center'>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text className='mt-4'>Memuat data tiket...</Text>
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView className='flex-1 bg-slate-100 justify-center items-center'>
                <Text className='text-red-500 mb-4'>{error}</Text>
                <Button onPress={handleCancel}>
                    <ButtonText>Kembali</ButtonText>
                </Button>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-slate-100'>
            <View className='mx-4 my-4'>
                <Text className='text-2xl font-bold'>Check-in</Text>
                <Text className='text-lg mb-4'>Untuk check-in, Anda dapat menggunakan salah satu mode berikut:</Text>
            </View>
            <Card className='mx-4 my-4 p-4 items-center'>
                {!nfcSupported ? (
                    <View className='items-center justify-center py-20'>
                        <Text className='text-center mb-4'>
                            Silakan aktifkan NFC di pengaturan perangkat Anda untuk melanjutkan.
                        </Text>
                        <Button onPress={handleCancel}>
                            <ButtonText>Kembali</ButtonText>
                        </Button>
                    </View>
                ) : hceEnabled ? (
                    <View className='items-center justify-center py-20'>
                        <IconSymbol name="network" size={80} color="#6366F1" />
                        <Text className='text-xl font-semibold mt-6 mb-2 text-indigo-600'>
                            Mode Emulasi Kartu (HCE) Aktif
                        </Text>
                        <Text className='text-center mb-2'>
                            Perangkat ini sedang menunggu untuk discan oleh perangkat organizer.
                        </Text>
                        <Text className='text-center mb-6'>
                            Kode Tiket: <Text className='font-bold'>{ticketCode}</Text>
                        </Text>
                        <Button onPress={() => setHceEnabled(false)} className='bg-red-500 mb-4 w-full'>
                            <ButtonText>Matikan Mode Emulasi</ButtonText>
                        </Button>
                        <Button variant="outline" onPress={handleCancel} className='w-full'>
                            <ButtonText>Kembali</ButtonText>
                        </Button>
                    </View>
                ) : nfcSuccess ? (
                    <View className='items-center justify-center py-20'>
                        <CheckCircleIcon color="green" />
                        <Text className='text-xl font-semibold text-green-500 mt-4 mb-2'>
                            Berhasil!
                        </Text>
                        <Text className='text-center mb-6'>
                            Kode tiket telah berhasil ditulis ke tag NFC fisik. Perangkat organizer dapat melakukan scan.
                        </Text>
                        <Button onPress={writeNfc} className='bg-indigo-600 mb-4 w-full'>
                            <ButtonText>Tulis Ulang ke Tag Fisik</ButtonText>
                        </Button>
                        <Button variant="outline" onPress={handleCancel} className='w-full'>
                            <ButtonText>Kembali</ButtonText>
                        </Button>
                    </View>
                ) : nfcWriting ? (
                    <View className='items-center justify-center py-20'>
                        <ActivityIndicator size="large" color="#6366F1" />
                        <Text className='text-xl font-semibold mt-4 mb-2'>
                            Menunggu Tag NFC Fisik...
                        </Text>
                        <Text className='text-center mb-6'>
                            Tempelkan perangkat Anda ke tag NFC fisik
                        </Text>
                        <Button variant="outline" onPress={() => NfcManager.cancelTechnologyRequest()}>
                            <ButtonText>Batalkan</ButtonText>
                        </Button>
                    </View>
                ) : (
                    <View className='items-center justify-center py-12'>
                        <IconSymbol 
                            name="network" 
                            size={80} 
                            color="#6366F1"
                        />
                        <Text className='text-xl font-semibold mt-6 mb-2'>
                            Pilih Mode Check-in
                        </Text>
                        <Text className='text-center mb-2'>
                            Kode Tiket: <Text className='font-bold'>{ticketCode}</Text>
                        </Text>
                        <Text className='text-center mb-6'>
                            Anda dapat:
                            {"\n"}- Aktifkan mode emulasi (HCE) agar HP ini bisa discan langsung oleh organizer
                            {"\n"}- Atau tulis kode tiket ke tag NFC fisik
                        </Text>
                        <Button onPress={() => setHceEnabled(true)} className='bg-indigo-600 mb-4 w-full'>
                            <ButtonText>Aktifkan Mode Emulasi (HCE)</ButtonText>
                        </Button>
                        <Button onPress={writeNfc} className='bg-slate-500 mb-4 w-full'>
                            <ButtonText>Tulis ke Tag Fisik</ButtonText>
                        </Button>
                        <Button variant="outline" onPress={handleCancel} className='w-full'>
                            <ButtonText>Batalkan</ButtonText>
                        </Button>
                    </View>
                )}
            </Card>
        </SafeAreaView>
    )
}