import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getToday, getGoal, addLog, deleteLog } from '../../services/hydration.service';
import { HydrationSummary } from '../../types';
import Loading from '../../components/common/Loading';
import Card    from '../../components/common/Card';
import Button  from '../../components/common/Button';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';

export default function HydrationScreen() {
  const [summary,    setSummary]    = useState<HydrationSummary | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adding,     setAdding]     = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getToday();
      setSummary(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleAddCup() {
    if (!summary) return;
    try {
      setAdding(true);
      await addLog(summary.cup_size_ml);
      await fetchData();
    } catch (err: unknown) {
      Alert.alert('Erro', (err as Error).message);
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteLog(id: string) {
    await deleteLog(id);
    await fetchData();
  }

  if (loading) return <Loading />;
  if (!summary) return null;

  const percentage = summary.percentage;
  const color = percentage >= 100 ? COLORS.secondary : percentage >= 50 ? COLORS.primary : COLORS.warning;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
      >
        <Text style={styles.title}>Hidratação</Text>

        {/* Progress */}
        <Card style={styles.progressCard}>
          <Text style={styles.emoji}>💧</Text>
          <Text style={[styles.bigValue, { color }]}>{summary.consumed_ml} ml</Text>
          <Text style={styles.goal}>meta diária: {summary.goal_ml} ml</Text>

          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
          </View>
          <Text style={[styles.percent, { color }]}>{percentage}% concluído</Text>
          <Text style={styles.cups}>{summary.cups} copo{summary.cups !== 1 ? 's' : ''} de {summary.cup_size_ml}ml</Text>
        </Card>

        {/* Add cup button */}
        <Button
          title={`+ Adicionar copo (${summary.cup_size_ml}ml)`}
          onPress={handleAddCup}
          loading={adding}
          style={styles.addBtn}
        />

        {/* Logs */}
        {summary.logs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Registros de hoje</Text>
            {[...summary.logs].reverse().map(log => (
              <Card key={log.id} style={styles.logCard}>
                <View style={styles.logRow}>
                  <Text style={styles.logText}>💧 {log.amount_ml} ml</Text>
                  <Text style={styles.logTime}>
                    {new Date(log.logged_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <TouchableOpacity onPress={() => handleDeleteLog(log.id)}>
                    <Ionicons name="close-circle-outline" size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: COLORS.background },
  scroll:        { padding: SPACING.md, paddingBottom: SPACING.xxl },
  title:         { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  progressCard:  { alignItems: 'center', padding: SPACING.lg, marginBottom: SPACING.md },
  emoji:         { fontSize: 56, marginBottom: SPACING.sm },
  bigValue:      { fontSize: FONT_SIZE.xxxl, fontWeight: '700' },
  goal:          { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 4 },
  barBg:         { width: '100%', height: 10, backgroundColor: COLORS.border, borderRadius: RADIUS.full, marginTop: SPACING.md, overflow: 'hidden' },
  barFill:       { height: '100%', borderRadius: RADIUS.full },
  percent:       { fontSize: FONT_SIZE.md, fontWeight: '600', marginTop: SPACING.sm },
  cups:          { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 4 },
  addBtn:        { marginBottom: SPACING.lg },
  sectionTitle:  { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  logCard:       { marginBottom: SPACING.xs },
  logRow:        { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  logText:       { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.text },
  logTime:       { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
});
