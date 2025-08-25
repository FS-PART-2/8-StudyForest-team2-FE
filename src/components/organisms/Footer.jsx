import styles from '../../styles/components/organisms/Footer.module.css';

export function Footer({ year, teamName }) {
  return (
    <footer className={styles.footer}>
      © {year} {teamName} All rights reserved.
    </footer>
  );
}
