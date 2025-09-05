import React from 'react';
import styles from '../../styles/components/molecules/StudyIntro.module.css';

/**
 * StudyIntro - 스터디 소개 molecule
 * @param {string} description - 스터디 소개글
 */
export default function StudyIntro({ description = '' }) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>소개</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
