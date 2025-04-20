import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button, ButtonText } from '@/components/ui/button';
import { useSession } from '@/hooks/auth/ctx';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import dayjs from 'dayjs';
import { rupiahFormat } from '@/helpers/currency';
import { dateIdFormat } from '@/helpers/date';
import { router } from 'expo-router';

const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Transaction {
  id: string;
  event: {
    nama: string;
  };
  waktu_pembayaran: string;
  total_pembayaran: number;
  created_at: string;
  status: string;
}

export default function TransactionList() {
  const { session } = useSession();

  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/transactions`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();

      setTransactions(json.data);
      return json.data;
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'payment':
        return 'info';
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'muted';
    }
  };

  const getRouterPath = (status: string, id: string) => {
    switch (status) {
      case 'pending':
        return router.push(`/transactions/${id}`);
      case 'payment':
        return router.push(`/transactions/${id}/payment`);
      case 'success':
        return router.push(`/transactions/${id}/success`);
      case 'failed':
        return null;
      default:
        return null;
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Spinner size="large" />
      </View>
    );
  }

  if (transactions.length === 0) {
    return <Text>No transactions found</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="px-4 py-2">
        <Text className="text-2xl font-bold mb-4">Daftar Transaksi</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item?.id.toString()}
          renderItem={({ item }) => (
            <Card className="mb-4">
              <View className="flex-row justify-between items-center">
                <View className="items-start">
                  <Text className="font-semibold">{item?.event?.nama}</Text>
                  <Badge size="sm" variant="solid" action={statusColor(item?.status)}>
                    <BadgeText>{item?.status.toUpperCase()}</BadgeText>
                  </Badge>
                  <Text className="text-sm text-gray-600">{dateIdFormat(item?.created_at)}</Text>
                  <Text className="text-sm text-gray-600">{Number(item?.total_pembayaran) === 0 ? 'Gratis' : rupiahFormat(item?.total_pembayaran)}</Text>
                </View>
                <Button
                  size="sm"
                  variant="solid"
                  action="primary"
                  onPress={() => getRouterPath(item?.status, item?.id)}
                >
                  <ButtonText>
                    {
                      item?.status === 'pending' || item?.status === 'payment' ?
                      'Lanjutkan' : 'Lihat'
                    }
                  </ButtonText>
                </Button>
              </View>
            </Card>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}