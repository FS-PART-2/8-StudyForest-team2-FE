import React from 'react';
import styles from '../../styles/components/molecules/StudyPoints.module.css';

/**
 * StudyPoints - 스터디 포인트 molecule
 * @param {number} points - 획득한 포인트
 */
export default function StudyPoints({ points = 0 }) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>현재까지 획득한 포인트</p>
      <div className={styles.pointsCard}>
        <div className={styles.pointsContainer}>
          <div className={styles.pointIcon}>
            <img
              src="/assets/icons/point.svg"
              alt="포인트 아이콘"
              width={24}
              height={24}
            />
          </div>
          <span className={styles.points}>{points}P 획득</span>
        </div>
      </div>
    </div>
  );
}
