import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTodayHabits, completeHabit, uncompleteHabit } from '../../services/habits.service';
import { HabitWithCompletion } from '../../types';
import Loading from '../../components/common/Loading';
import Card    from '../../components/common/Card';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';

export default function HabitsScreen() {
  const [habits,     setHabits]     = useState<HabitWithCompletion[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getTodayHabits();
      setHabits(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleToggle(habit: HabitWithCompletion) {
    try {
      if (habit.completed_today) {
        await uncompleteHabit(habit.id);
      } else {
        await completeHabit(habit.id);
      }
      setHabits(prev =>
        prev.map(h => h.id === habit.id ? { ...h, completed_today: !h.completed_today } : h)
      );
    } catch (err: unknown) {
      Alert.alert('Erro', (err as Error).message);
    }
  }

  if (loading) return <Loading />;

  const completed = habits.filter(h => h.completed_today).length;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.title}>Hábitos</Text>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryText}>
                {completed} / {habits.length} concluídos hoje
              </Text>
              <View style={styles.barBg}>
                <View style={[
                  styles.barFill,
                  { width: habits.length > 0 ? `${(completed / habits.length) * 100}%` : '0%' },
                ]} />
              </View>
            </Card>
          </>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum hábito cadastrado</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleToggle(item)} activeOpacity={0.7}>
            <Card style={[styles.card, item.completed_today && styles.cardDone]}>
              <View style={styles.row}>
                <View style={[styles.iconBg, { backgroundColor: item.color + '22' }]}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={[styles.habitName, item.completed_today && styles.habitDone]}>
                  {item.name}
                </Text>
                <View style={[styles.check, item.completed_today && styles.checkDone]}>
                  {item.completed_today && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: COLORS.background },
  list:         { padding: SPACING.md, paddingBottom: SPACING.xxl },
  title:        { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  summaryCard:  { marginBottom: SPACING.md },
  summaryText:  { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  barBg:        { height: 8, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden' },
  barFill:      { height: '100%', backgroundColor: COLORS.secondary, borderRadius: RADIUS.full },
  card:         { marginBottom: SPACING.sm },
  cardDone:     { opacity: 0.75 },
  row:          { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconBg:       { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  icon:         { fontSize: 20 },
  habitName:    { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '500', color: COLORS.text },
  habitDone:    { textDecorationLine: 'line-through', color: COLORS.textMuted },
  check:        { width: 26, height: 26, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  checkDone:    { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  checkMark:    { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  empty:        { textAlign: 'center', color: COLORS.textMuted, paddingVertical: SPACING.xl },
});
