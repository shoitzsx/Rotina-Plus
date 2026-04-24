import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboard } from '../../services/dashboard.service';
import { DashboardData } from '../../types';
import Loading from '../../components/common/Loading';
import Card    from '../../components/common/Card';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [data,       setData]       = useState<DashboardData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result = await getDashboard();
      setData(result);
    } catch {
      // silently fail on refresh
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Loading />;

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        {/* Hydration Card */}
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>💧</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Hidratação</Text>
              <Text style={styles.cardValue}>
                {data?.hydration.consumed_ml ?? 0} / {data?.hydration.goal_ml ?? 2000} ml
              </Text>
            </View>
            <Text style={styles.cardPercent}>{data?.hydration.percentage ?? 0}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${data?.hydration.percentage ?? 0}%` }]} />
          </View>
        </Card>

        {/* Finance Card */}
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>💰</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Finanças hoje</Text>
              <Text style={[styles.cardValue, { color: COLORS.secondary }]}>
                +R$ {(data?.finances.income ?? 0).toFixed(2)}
              </Text>
              <Text style={[styles.cardValue, { color: COLORS.danger }]}>
                -R$ {(data?.finances.expenses ?? 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Habits Card */}
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>✅</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Hábitos</Text>
              <Text style={styles.cardValue}>
                {data?.habits.completed ?? 0} / {data?.habits.total ?? 0} concluídos
              </Text>
            </View>
          </View>
        </Card>

        {/* Study Card */}
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>📚</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Estudos hoje</Text>
              <Text style={styles.cardValue}>
                {Math.floor((data?.study.minutes ?? 0) / 60)}h {(data?.study.minutes ?? 0) % 60}min
              </Text>
            </View>
          </View>
        </Card>

        {/* Today's Events */}
        <Text style={styles.sectionTitle}>Agenda de hoje</Text>
        {(data?.today_events.length ?? 0) === 0 ? (
          <Text style={styles.empty}>Nenhum evento para hoje</Text>
        ) : (
          data?.today_events.map(event => (
            <Card key={event.id} style={[styles.eventCard, { borderLeftColor: event.color }]}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              {!event.all_day && (
                <Text style={styles.eventTime}>
                  {new Date(event.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: COLORS.background },
  scroll:        { padding: SPACING.md, paddingBottom: SPACING.xxl },
  header:        { marginBottom: SPACING.lg },
  greeting:      { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },
  date:          { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2, textTransform: 'capitalize' },
  card:          { marginBottom: SPACING.md },
  cardRow:       { flexDirection: 'row', alignItems: 'center' },
  cardIcon:      { fontSize: 28, marginRight: SPACING.sm },
  cardContent:   { flex: 1 },
  cardTitle:     { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, fontWeight: '500' },
  cardValue:     { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.text },
  cardPercent:   { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.primary },
  progressBar:   { height: 6, backgroundColor: COLORS.border, borderRadius: RADIUS.full, marginTop: SPACING.sm, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full },
  sectionTitle:  { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  empty:         { color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.md },
  eventCard:     { marginBottom: SPACING.sm, borderLeftWidth: 4 },
  eventTitle:    { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  eventTime:     { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
});
