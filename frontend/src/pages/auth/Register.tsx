import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>Rotina<span>+</span></h1>
        <p className={styles.subtitle}>Crie sua conta grátis</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Nome
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </label>

          <label className={styles.label}>
            E-mail
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
            />
          </label>

          <label className={styles.label}>
            Senha
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p className={styles.footer}>
          Já tem conta?{' '}
          <Link to="/login" className={styles.link}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
