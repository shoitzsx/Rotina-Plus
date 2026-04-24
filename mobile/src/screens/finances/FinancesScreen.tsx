import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTransactions, getMonthlySummary, deleteTransaction } from '../../services/finances.service';
import { Transaction, FinanceSummary } from '../../types';
import Loading from '../../components/common/Loading';
import Card    from '../../components/common/Card';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';

export default function FinancesScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary,      setSummary]      = useState<FinanceSummary | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [txs, sum] = await Promise.all([getTransactions(), getMonthlySummary()]);
      setTransactions(txs);
      setSummary(sum);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(id: string) {
    Alert.alert('Excluir transação', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id);
          await fetchData();
        },
      },
    ]);
  }

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.title}>Finanças</Text>
            {summary && (
              <View style={styles.summaryRow}>
                <Card style={[styles.summaryCard, styles.incomeCard]}>
                  <Text style={styles.summaryLabel}>Receitas</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
                    R$ {summary.income.toFixed(2)}
                  </Text>
                </Card>
                <Card style={[styles.summaryCard, styles.expenseCard]}>
                  <Text style={styles.summaryLabel}>Gastos</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.danger }]}>
                    R$ {summary.expenses.toFixed(2)}
                  </Text>
                </Card>
              </View>
            )}
            {summary && (
              <Card style={styles.balanceCard}>
                <Text style={styles.summaryLabel}>Saldo do mês</Text>
                <Text style={[styles.balanceValue, { color: (summary.balance ?? 0) >= 0 ? COLORS.secondary : COLORS.danger }]}>
                  R$ {(summary.balance ?? 0).toFixed(2)}
                </Text>
              </Card>
            )}
            <Text style={styles.sectionTitle}>Transações</Text>
          </>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação este mês</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.txIcon}>
                {item.transaction_categories?.icon ?? (item.type === 'income' ? '💰' : '💸')}
              </Text>
              <View style={styles.info}>
                <Text style={styles.txTitle}>{item.title}</Text>
                {item.transaction_categories && (
                  <Text style={styles.txCategory}>{item.transaction_categories.name}</Text>
                )}
                <Text style={styles.txDate}>
                  {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </Text>
              </View>
              <Text style={[styles.txAmount, { color: item.type === 'income' ? COLORS.secondary : COLORS.danger }]}>
                {item.type === 'income' ? '+' : '-'}R$ {Number(item.amount).toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: COLORS.background },
  list:          { padding: SPACING.md, paddingBottom: SPACING.xxl },
  title:         { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  summaryRow:    { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  summaryCard:   { flex: 1 },
  incomeCard:    {},
  expenseCard:   {},
  summaryLabel:  { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, fontWeight: '500' },
  summaryValue:  { fontSize: FONT_SIZE.lg, fontWeight: '700', marginTop: 2 },
  balanceCard:   { marginBottom: SPACING.md },
  balanceValue:  { fontSize: FONT_SIZE.xl, fontWeight: '700', marginTop: 2 },
  sectionTitle:  { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  card:          { marginBottom: SPACING.xs },
  row:           { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  txIcon:        { fontSize: 24 },
  info:          { flex: 1 },
  txTitle:       { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  txCategory:    { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  txDate:        { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  txAmount:      { fontSize: FONT_SIZE.md, fontWeight: '700' },
  deleteBtn:     { padding: SPACING.xs },
  empty:         { textAlign: 'center', color: COLORS.textMuted, paddingVertical: SPACING.xl },
});
