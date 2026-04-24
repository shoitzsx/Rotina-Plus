import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getEvents, deleteEvent } from '../../services/agenda.service';
import { Event } from '../../types';
import Loading from '../../components/common/Loading';
import Card    from '../../components/common/Card';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';

export default function AgendaScreen() {
  const [events,     setEvents]     = useState<Event[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  async function handleDelete(id: string) {
    Alert.alert('Excluir evento', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          await deleteEvent(id);
          setEvents(prev => prev.filter(e => e.id !== id));
        },
      },
    ]);
  }

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchEvents(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum evento encontrado</Text>}
        renderItem={({ item }) => (
          <Card style={[styles.card, { borderLeftColor: item.color ?? COLORS.primary }]}>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                {item.description ? (
                  <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                ) : null}
                <Text style={styles.time}>
                  {item.all_day
                    ? 'Dia inteiro'
                    : `${new Date(item.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} – ${new Date(item.end_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                </Text>
                <Text style={styles.date}>
                  {new Date(item.start_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.background },
  header:      { padding: SPACING.md, paddingBottom: 0 },
  title:       { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text },
  list:        { padding: SPACING.md, paddingBottom: SPACING.xxl },
  card:        { marginBottom: SPACING.sm, borderLeftWidth: 4 },
  row:         { flexDirection: 'row', alignItems: 'center' },
  info:        { flex: 1 },
  eventTitle:  { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  desc:        { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
  time:        { fontSize: FONT_SIZE.sm, color: COLORS.primary, marginTop: 4 },
  date:        { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  empty:       { textAlign: 'center', color: COLORS.textMuted, paddingVertical: SPACING.xl },
});
