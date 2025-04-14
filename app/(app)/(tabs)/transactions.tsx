import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button, ButtonText } from '@/components/ui/button';

const dummyTransactions = [
  {
    id: 1,
    event_name: 'Concert A',
    date: '2025-04-10',
    total: 500000,
  },
  {
    id: 2,
    event_name: 'Seminar B',
    date: '2025-04-12',
    total: 200000,
  },
  {
    id: 3,
    event_name: 'Workshop C',
    date: '2025-04-14',
    total: 300000,
  },
];

export default function TransactionList() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="px-4 py-2">
        <Text className="text-2xl font-bold mb-4">Daftar Transaksi</Text>
        <FlatList
          data={dummyTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card className="mb-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold">{item.event_name}</Text>
                  <Text className="text-sm text-gray-600">{item.date}</Text>
                  <Text className="text-sm text-gray-600">Total: Rp {item.total}</Text>
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