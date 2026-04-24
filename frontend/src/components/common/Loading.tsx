import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} aria-label="Carregando" />
    </div>
  );
}
