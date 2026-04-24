import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Input  from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants/theme';
import { AuthStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { signUp } = useAuth();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    try {
      setLoading(true);
      await signUp(name.trim(), email.trim().toLowerCase(), password);
    } catch (err: unknown) {
      Alert.alert('Erro', (err as Error).message ?? 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>📅</Text>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Comece a organizar sua rotina hoje</Text>
        </View>

        <View style={styles.form}>
          <Input label="Nome" placeholder="Seu nome" value={name} onChangeText={setName} />
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Criar conta" onPress={handleRegister} loading={loading} style={styles.btn} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>
              Já tem conta? <Text style={styles.linkBold}>Entrar</Text>
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
