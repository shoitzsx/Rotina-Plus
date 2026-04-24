import { useAuth } from '@/context/AuthContext';
import styles from './Home.module.css';

const modules = [
  { icon: '📅', label: 'Agenda' },
  { icon: '💧', label: 'Hidratação' },
  { icon: '💰', label: 'Finanças' },
  { icon: '📚', label: 'Estudos' },
  { icon: '✅', label: 'Hábitos' },
  { icon: '🥗', label: 'Nutrição' },
];

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.logo}>Rotina<span>+</span></h1>
          <p className={styles.slogan}>Organize sua vida em um só lugar</p>
        </div>
        <div className={styles.userBar}>
          <span className={styles.userName}>Olá, {user?.name ?? 'usuário'}</span>
          <button className={styles.logoutBtn} onClick={logout}>Sair</button>
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>Módulos</h2>
        <div className={styles.grid}>
          {modules.map(({ icon, label }) => (
            <div key={label} className={styles.card}>
              <span className={styles.cardIcon}>{icon}</span>
              <span className={styles.cardLabel}>{label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
