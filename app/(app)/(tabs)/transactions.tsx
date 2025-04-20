import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button, ButtonText } from '@/components/ui/button';
import { useSession } from '@/hooks/auth/ctx';
import { Badge, BadgeText } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { rupiahFormat } from '@/helpers/currency';
import { dateIdFormat } from '@/helpers/date';

const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Transaction {
  id: number;
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
  // const [error, setError,] = React.useState(null);

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

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
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
                  variant="solid"
                  action="primary"
                  onPress={() => {
                    // Navigate to transaction detail page
                  }}
                >
                  <ButtonText>Detail</ButtonText>
                </Button>
              </View>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}