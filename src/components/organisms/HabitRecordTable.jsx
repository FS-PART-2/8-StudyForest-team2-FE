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
    // 전달받은 데이터가 있으면 API 호출하지 않음
    if (hasPropRows) {
      console.log('HabitRecordTable: 전달받은 습관 데이터 사용');
      return;
    }

    // 전달받은 데이터가 없을 때만 API 호출 시도
    if (!studyId) {
      console.log(
        'HabitRecordTable: studyId가 없어서 습관 데이터를 로드하지 않습니다.',
      );
      setApiRows([]);
      return;
    }

    // 비밀번호가 undefined이면 API 호출하지 않음 (공개 스터디가 아닌 경우)
    if (password === undefined) {
      console.log(
        'HabitRecordTable: 비밀번호가 없어서 습관 데이터를 로드하지 않습니다.',
      );
      setApiRows([]);
      return;
    }

    (async () => {
      try {
        // 공개 스터디의 경우 비밀번호 없이 API 호출
        const apiParams = { weekDate };
        if (password !== undefined) {
          apiParams.password = password;
        }

        const data = await habitWeekApi.getHabitWeekApi(studyId, apiParams);
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
        // 401 에러인 경우 비밀번호가 필요한 스터디임을 표시
        if (error?.response?.status === 401) {
          console.log('HabitRecordTable: 비밀번호가 필요한 스터디입니다.');
        }
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
      {/* 타이틀 부분 */}
      <h3 className={styles.title}>습관 기록표</h3>

      {/* 컨텍스트 부분 - 습관 유무에 따라 변경 */}
      <div className={styles.context}>
        {rows.length > 0 ? (
          /* 습관이 있을 때: 고정된 요일 헤더 + 스크롤 가능한 습관 리스트들 */
          <>
            {/* 고정된 요일 헤더 */}
            <div className={styles.fixedHeader}>
              <HabitWeekRow showDaysHeader />
            </div>
            {/* 스크롤 가능한 습관 리스트 */}
            <div className={styles.scrollableContent} role="table">
              {rows.map((r, idx) => {
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
                    key={r.id || `habit-${idx}`}
                    name={r.name}
                    checks={r.checks}
                    activeColor={colorToken}
                  />
                );
              })}
            </div>
          </>
        ) : (
          /* 습관이 없을 때: 안내 메시지 */
          <div className={styles.emptyMessage}>
            <p>아직 습관이 없어요</p>
            <p>오늘의 습관에서 습관을 생성해보세요</p>
          </div>
        )}
      </div>
    </section>
  );
}
