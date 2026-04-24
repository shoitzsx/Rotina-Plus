import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';

interface MenuItem {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  color: string;
  onPress: () => void;
}

export default function MoreScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  }

  const menuItems: MenuItem[] = [
    { icon: 'book-outline',      label: 'Estudos',     color: '#8B5CF6', onPress: () => navigation.navigate('Studies') },
    { icon: 'restaurant-outline', label: 'Alimentação', color: '#F59E0B', onPress: () => navigation.navigate('Nutrition') },
    { icon: 'checkmark-circle-outline', label: 'Hábitos', color: '#10B981', onPress: () => navigation.navigate('Habits') },
    { icon: 'person-outline',    label: 'Perfil',      color: COLORS.primary, onPress: () => navigation.navigate('Profile') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Mais</Text>

        {/* User info */}
        <Card style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </Card>

        {/* Menu items */}
        {menuItems.map(item => (
          <TouchableOpacity key={item.label} onPress={item.onPress} activeOpacity={0.7}>
            <Card style={styles.menuCard}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '22' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </Card>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: COLORS.background },
  scroll:     { padding: SPACING.md, paddingBottom: SPACING.xxl },
  title:      { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  userCard:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  avatar:     { width: 50, height: 50, borderRadius: RADIUS.full, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.white, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  userName:   { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text },
  userEmail:  { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  menuCard:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  menuIcon:   { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  menuLabel:  { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '500', color: COLORS.text },
  logoutBtn:  { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, justifyContent: 'center', marginTop: SPACING.xl },
  logoutText: { color: COLORS.danger, fontSize: FONT_SIZE.md, fontWeight: '600' },
});
