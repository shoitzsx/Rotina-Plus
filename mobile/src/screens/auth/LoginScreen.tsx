import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Input   from '../../components/common/Input';
import Button  from '../../components/common/Button';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';
import { AuthStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn } = useAuth();

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [loading,   setLoading]   = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    try {
      setLoading(true);
      await signIn(email.trim().toLowerCase(), password);
    } catch (err: unknown) {
      Alert.alert('Erro', (err as Error).message ?? 'Falha ao entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>📅</Text>
          <Text style={styles.title}>Rotina+</Text>
          <Text style={styles.subtitle}>Organize sua vida em um só lugar</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Entrar" onPress={handleLogin} loading={loading} style={styles.btn} />

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>
              Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  header:    { alignItems: 'center', marginBottom: SPACING.xxl },
  logo:      { fontSize: 56, marginBottom: SPACING.sm },
  title:     { fontSize: FONT_SIZE.xxxl, fontWeight: '700', color: COLORS.primary },
  subtitle:  { fontSize: FONT_SIZE.md, color: COLORS.textMuted, marginTop: SPACING.xs },
  form:      { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg },
  btn:       { marginTop: SPACING.sm },
  link:      { textAlign: 'center', marginTop: SPACING.md, color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  linkBold:  { color: COLORS.primary, fontWeight: '600' },
});
