import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/components/organisms/HabitRecordTable.module.css';
import Sticker from '../atoms/Sticker.jsx';
import HabitWeekRow from '../molecules/HabitWeekRow.jsx';
import { habitWeekApi } from '../../utils/api/habit/getHabitWeekApi.js';

/**
 * 습관 기록표 (주간)
 * - 모양 우선 구현: 이름 열 + 7일 스티커 그리드
 * - 데이터는 rows prop 또는 API(studyId)로 로딩
 */
export default function HabitRecordTable({
  studyId,
  weekDate,
  password,
  rows: rowsProp = [],
}) {
  // rowsProp이 있으면 직접 사용, 없으면 API로 로드
  const [apiRows, setApiRows] = useState([]);
  const hasPropRows = rowsProp && rowsProp.length > 0;

  // rowsProp이 있으면 그것을 사용, 없으면 API 데이터 사용
  const rows = hasPropRows ? rowsProp : apiRows;

  useEffect(() => {
    if (hasPropRows || !studyId) return; // 우선순위: 전달된 데이터 사용

    // 비밀번호가 없으면 API 호출하지 않음 (공개 스터디가 아닌 경우)
    if (!password) {
      console.log(
        'HabitRecordTable: 비밀번호가 없어서 습관 데이터를 로드하지 않습니다.',
      );
      setApiRows([]);
      return;
    }

    (async () => {
      try {
        const data = await habitWeekApi.getHabitWeekApi(studyId, {
          weekDate,
          password,
        });
        // 예상 형태에 맞게 변환 (shape만): [{ name, checks:[...7] }]
        const mapped = Array.isArray(data?.habits)
          ? data.habits.map(h => ({
              name: h.name || h.title || '습관',
              checks: Array.isArray(h.checks)
                ? h.checks
                : [
                    !!h.mon,
                    !!h.tue,
                    !!h.wed,
                    !!h.thu,
                    !!h.fri,
                    !!h.sat,
                    !!h.sun,
                  ],
            }))
          : [];
        setApiRows(mapped);
      } catch (error) {
        console.log('HabitRecordTable: 습관 데이터 로드 실패:', error.message);
        // 실패 시 빈 상태 유지 (모양만 유지)
        setApiRows([]);
      }
    })();
  }, [hasPropRows, studyId, weekDate, password]);

  const dayNames = useMemo(
    () => ['월', '화', '수', '목', '금', '토', '일'],
    [],
  );

  return (
    <section className={styles.frame}>
      <h3 className={styles.title}>습관 기록표</h3>

      {/* 요일 헤더 한 번만 */}
      <HabitWeekRow showDaysHeader />

      <div className={styles.table} role="table">
        {rows.length > 0 ? (
          rows.map((r, idx) => {
            const palette = [
              'sticker-blue-5',
              'sticker-sage-3',
              'sticker-teal-2',
              'sticker-ocean-1',
            ];
            const colorToken =
              r.activeColor || r.color || palette[idx % palette.length];
            return (
              <HabitWeekRow
                key={idx}
                name={r.name}
                checks={r.checks}
                activeColor={colorToken}
              />
            );
          })
        ) : (
          <div className={styles.emptyMessage}>
            {!password ? (
              <p>습관 데이터를 보려면 비밀번호가 필요합니다.</p>
            ) : (
              <p>등록된 습관이 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
