import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, RefreshControl } from 'react-native';
import { Card } from '@/components/ui/card';
import { router, useLocalSearchParams } from 'expo-router';
import { useSession } from '@/hooks/auth/ctx';
import { dateIdFormat } from '@/helpers/date';
import { rupiahFormat } from '@/helpers/currency';
import { DUMMY_POSTER } from '@/constants/events-data';
import { Spinner } from '@/components/ui/spinner';
import { Badge, BadgeText } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import AbsoluteBottomView from '@/components/AbsoluteBottomView';
import { Button, ButtonText } from '@/components/ui/button';
import { Alert } from 'react-native';

// Define ticket status badge colors
const statusColors: Record<string, "success" | "warning" | "info" | "error" | "muted"> = {
  inactive: "muted",
  active: "success",
  resale: "info",
  sold: "warning",
  checkin: "success"
};

const TicketDetail = () => {
  const { id } = useLocalSearchParams();
  const { session } = useSession();
  
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

  const fetchTicketDetail = async () => {
    try {
      const response = await fetch(`${apiUrl}/ticket-issued/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ticket: ${response.status}`);
      }

      const data = await response.json();
      setTicket(data?.data ?? null);
      console.log("Ticket data:", data?.data ?? 'No data');
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      setError("Failed to load ticket details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id && session) {
      setLoading(true);
      fetchTicketDetail();
    }
  }, [id, session]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTicketDetail();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-slate-100 justify-center items-center">
        <Spinner size="large" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View className="flex-1 bg-slate-100 p-4 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  const event = ticket?.transaction_item?.transaction?.event ?? null;
  const transaction = ticket?.transaction_item?.transaction ?? null;
  const resale = ticket?.resale ?? null;
  const transactionItem = ticket?.transaction_item ?? null;

  return (
    <SafeAreaView 
      className="flex-1 bg-slate-100"
      style={{ paddingTop: 0 }}
    >
      <ScrollView
        className="flex-1 bg-slate-100"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View className="p-4">
          {/* Event Information */}
          <Card className="p-4 mb-4">
            <View className="items-center mb-6">
              <Image
                source={DUMMY_POSTER}
                className="w-40 h-40 rounded-lg mb-4"
              />
              {event && (
                <View className="items-center">
                  <Text className="text-2xl font-extrabold text-black mb-2">{event?.nama ?? 'No Event Name'}</Text>
      
                  {/* Ticket Type - No Badge, just styled text */}
                  <Text className="text-md font-bold text-purple-600 mb-2">
                    {transactionItem?.nama?.toUpperCase() ?? 'N/A'}
                  </Text>
      
                  {/* Status Badge */}
                  <Badge
                    className="px-4 py-1"
                    action={statusColors[ticket?.status ?? ''] ?? "muted"}
                    variant="solid"
                  >
                    <BadgeText className="text-sm font-bold">
                      {(ticket?.status ?? 'unknown').toUpperCase()}
                    </BadgeText>
                  </Badge>
                </View>
              )}
            </View>
      
            {event && (
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Tanggal</Text>
                  <Text className="text-base font-normal">{event?.jadwal_mulai ? dateIdFormat(event.jadwal_mulai) : '-'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Lokasi</Text>
                  <Text className="text-base font-normal">
                    {(event?.lokasi ?? '') === 'online' ? 'Online' : event?.kota ?? '-'}
                  </Text>
                </View>
                {event?.alamat_lengkap && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Alamat</Text>
                    <Text className="text-base font-normal text-right flex-1 ml-4">{event.alamat_lengkap}</Text>
                  </View>
                )}
              </View>
            )}
          </Card>
          {/* Ticket Information */}
          <Card className="p-4 mb-4">
            <Text className="text-lg font-bold mb-3">Detail Tiket</Text>
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Harga Pembelian</Text>
                <Text className="text-base font-normal">{rupiahFormat(transactionItem?.harga_satuan ?? 0)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Email Penerima</Text>
                <Text className="text-base font-normal">{ticket?.email_penerima ?? '-'}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Waktu Penerbitan</Text>
                <Text className="text-base font-normal">
                  {ticket?.waktu_penerbitan ? dateIdFormat(ticket.waktu_penerbitan) : '-'}
                </Text>
              </View>
            </View>
          </Card>
      
          {/* Resale Information (if applicable) */}
          {(ticket?.status ?? '') === "resale" && resale && (
            <Card className="p-4 mb-4 bg-blue-100">
              <Text className="text-lg font-bold mb-3">Detail Resale</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Harga Jual</Text>
                  <Text className="text-base font-semibold text-purple-600">{rupiahFormat(resale?.harga_jual ?? 0)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Status Resale</Text>
                  <Text className="text-base font-normal">{resale?.status ?? '-'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Tanggal Listing</Text>
                  <Text className="text-base font-normal">
                    {resale?.created_at ? dateIdFormat(resale.created_at) : '-'}
                  </Text>
                </View>
                <View>
                  <Button
                    className="w-full mt-4"
                    variant="link"
                    action='negative'
                    size="sm"
                    onPress={() => {
                      // Handle resale action here
                      console.log("Resale action triggered");
                      Alert.alert(
                        "Batalkan Penjualan Tiket",
                        "Apakah Anda yakin ingin membatalkan penjualan tiket ini?",
                        [
                          { text: "Batal", style: "cancel" },
                          {
                            text: "Yakin",
                            onPress: () => {
                              // Call API to cancel resale
                              console.log("Resale cancelled");
                            },
                          },
                        ],
                        { cancelable: true }
                      );
                    }}
                  >
                    <ButtonText>
                      Batalkan Penjualan Tiket
                    </ButtonText>
                  </Button>
                </View>
              </View>
            </Card>
          )}
          {/* Transaction Information */}
          {transaction && (
            <Card className="p-4">
              <Text className="text-lg font-bold mb-3">Detail Transaksi</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">ID Transaksi</Text>
                  <Text className="text-base font-normal">{transaction?.id ? transaction.id.substring(0, 8) : '-'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Status Transaksi</Text>
                  <Text className="text-base font-normal">{transaction?.status ?? '-'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Metode Pembayaran</Text>
                  <Text className="text-base font-normal">{(transaction?.metode_pembayaran ?? '').toUpperCase() || '-'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Total Pembayaran</Text>
                  <Text className="text-base font-normal">{rupiahFormat(transaction?.total_pembayaran ?? 0)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Waktu Pembayaran</Text>
                  <Text className="text-base font-normal">
                    {transaction?.waktu_pembayaran ? dateIdFormat(transaction.waktu_pembayaran) : '-'}
                  </Text>
                </View>
                <View>
                  <Button
                    className="w-full mt-4"
                    variant="link"
                    action='primary'
                    size="sm"
                    onPress={() => {
                      // Handle transaction action here
                      console.log("Transaction action triggered");
                      router.push(`/transactions/${transaction?.id}/success`);
                    }}
                  >
                    <ButtonText>
                      Lihat Detail Transaksi
                    </ButtonText>
                  </Button>
                </View>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TicketDetail;