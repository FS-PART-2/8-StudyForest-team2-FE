// src/pages/StudyModifyPage.jsx
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/atoms/Input.jsx';
import Button from '../components/atoms/Button.jsx';
import ToggleSwitch from '../components/atoms/ToggleSwitch.jsx';
import PasswordInput from '../components/molecules/PasswordInput.jsx';
import { studyApi } from '../utils/api/study/getStudyApi';
import { modifyStudy } from '../utils/api/study/modifyStudyApi';
import styles from '../styles/pages/StudyCreatePage.module.css';

/**
 * 스터디 수정하기 페이지 (Named Export)
 */
export function StudyModifyPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔒 폭 제어용 래퍼 클래스 (PC 600px / Mobile 312px)
  const FIELD_WRAP_CLASS = 'mm-field-600-312';

  // ── 폼 상태 ───────────────────────────────────────────────────────────────
  const [studyName, setStudyName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedBgId, setSelectedBgId] = useState('img-01');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  // ─────────────────────────────────────────────────────────────────────────

  const base = import.meta.env.BASE_URL || '/';

  // API에서 받아오는 배경 경로를 올바른 경로로 매핑
  const mapBackgroundPath = originalPath => {
    if (!originalPath) return null;

    // 기존 잘못된 경로들을 올바른 경로로 매핑
    const pathMapping = {
      '/img/default.png': '/assets/images/card-bg-color-01.svg',
      '/img/img-01.png': '/assets/images/card-bg-color-01.svg',
      '/img/img-02.png': '/assets/images/card-bg-color-02.svg',
      '/img/img-03.png': '/assets/images/card-bg-color-03.svg',
      '/img/img-04.png': '/assets/images/card-bg-color-04.svg',
      '/img/img-05.png': '/assets/images/card-bg-01.svg',
      '/img/img-06.png': '/assets/images/card-bg-02.svg',
      '/img/img-07.png': '/assets/images/card-bg-03.svg',
      '/img/img-08.png': '/assets/images/card-bg-04.svg',
      '/assets/images/bg-desk-1.svg': '/assets/images/card-bg-01.svg',
      '/assets/images/bg-laptop-1.svg': '/assets/images/card-bg-02.svg',
      '/assets/images/bg-tiles-1.svg': '/assets/images/card-bg-03.svg',
      '/assets/images/bg-plant-1.svg': '/assets/images/card-bg-04.svg',
    };

    return pathMapping[originalPath] || originalPath;
  };

  const backgrounds = useMemo(
    () => [
      {
        id: 'img-01',
        type: 'color',
        value: 'var(--card-blue)',
        name: '연한 파란색',
      },
      {
        id: 'img-02',
        type: 'color',
        value: 'var(--card-green)',
        name: '연한 초록색',
      },
      {
        id: 'img-03',
        type: 'color',
        value: 'var(--card-mintblue)',
        name: '어두운 회색',
      },
      {
        id: 'img-04',
        type: 'color',
        value: 'var(--card-ocean)',
        name: '연한 보라색',
      },
      {
        id: 'img-05',
        type: 'image',
        value: `${base}assets/images/card-bg-01.svg`,
        name: '작업공간',
      },
      {
        id: 'img-06',
        type: 'image',
        value: `${base}assets/images/card-bg-02.svg`,
        name: '노트북',
      },
      {
        id: 'img-07',
        type: 'image',
        value: `${base}assets/images/card-bg-03.svg`,
        name: '패턴',
      },
      {
        id: 'img-08',
        type: 'image',
        value: `${base}assets/images/card-bg-04.svg`,
        name: '식물',
      },
    ],
    [base],
  );

  // 기존 스터디 데이터 로드
  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        setLoading(true);
        const data = await studyApi.getStudyDetailApi(id);
        if (data) {
          setStudyName(data.name || '');
          setDescription(data.description || data.content || '');
          const serverBg = data.background ?? data.img ?? null; // 서버가 주는 실제 값(색상/URL) or 과거 id
          if (serverBg) {
            const mappedBg = mapBackgroundPath(serverBg);
            const matched = backgrounds.find(
              bg =>
                bg.value === mappedBg ||
                bg.value === serverBg ||
                bg.id === serverBg,
            );
            setSelectedBgId(matched ? matched.id : 'img-01');
          } else {
            setSelectedBgId('img-01');
          }
          setIsPublic(data.isPublic !== false);

          // 디버깅을 위한 로그
          console.log('StudyModifyPage - 로드된 스터디 데이터:', data);
        }
      } catch (error) {
        console.error('스터디 데이터 로딩 실패:', error);
        alert('스터디 정보를 불러올 수 없습니다.');
        navigate(`/study/${id}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudyData();
    }
  }, [id, navigate, backgrounds]);

  // 실시간 불일치 제거

  // 필수 필드 검증
  const isFormValid = studyName.trim() && password.trim();

  // 유효성 검사
  const validate = () => {
    const next = {};
    if (!studyName.trim()) next.studyName = '*스터디 이름을 입력해주세요';
    if (!password.trim()) next.password = '*비밀번호를 입력해주세요';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // blur 시 개별 필드 유효성 검사 (닉네임 제외)
  const validateField = (fieldName, value) => {
    console.log('validateField called:', fieldName, value);
    const next = { ...errors };

    if (fieldName === 'studyName') {
      if (!value.trim()) {
        next.studyName = '*스터디 이름을 입력해주세요';
      } else {
        delete next.studyName;
      }
    }

    if (fieldName === 'password') {
      if (!value.trim()) {
        next.password = '*비밀번호를 입력해주세요';
      } else {
        delete next.password;
      }
    }

    // passwordConfirm 필드 검증 제거

    setErrors(next);
  };

  // 제출
  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    try {
      setSubmitting(true);

      const selected = backgrounds.find(bg => bg.id === selectedBgId);
      const background = selected?.id ?? selectedBgId; // id 미스매치 대비 안전장치

      // 스터디 수정 API 호출
      await modifyStudy(id, {
        studyName: studyName.trim(),
        description: description.trim(),
        background,
        password,
        isPublic,
      });

      alert('스터디 수정이 완료되었습니다.');
      navigate(`/study/${id}`);
    } catch (err) {
      const serverCode = err?.response?.data?.code;
      const serverMsg = err?.response?.data?.message;
      const fallbackMsg = err?.message || '알 수 없는 오류';
      if (serverCode === 'PASSWORD_MISMATCH')
        alert('비밀번호가 일치하지 않습니다.');
      else alert(`스터디 수정 실패: ${serverMsg || fallbackMsg}`);
      // eslint-disable-next-line no-console
      console.error('[modifyStudy:error]', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          스터디 정보를 불러오는 중...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <style>{`
        /* 필드 래퍼: PC 600 / 모바일 312 */
        .${FIELD_WRAP_CLASS} { width: 60rem; max-width: 100%; }
        @media (max-width: 768px) {
          .${FIELD_WRAP_CLASS} { width: 31.2rem; }
        }

        /* 폼 카드 자체 폭을 최소 640px로 보장(패딩 여유 포함) */
        @media (min-width: 769px) {
          .mm-form-600 { width: 64rem; max-width: 100%; margin: 0 auto; }
        }

        /* aria-invalid 보더 경고 */
        :where(input, textarea)[aria-invalid="true"] {
          border-color: var(--warning-red) !important;
          outline-color: var(--warning-red) !important;
        }
      `}</style>

      <form
        className={`${styles.card} mm-form-600`}
        onSubmit={handleSubmit}
        noValidate
      >
        <h1 className={styles.title}>스터디 수정하기</h1>

        {/* 스터디 이름 */}
        <section className={styles.section}>
          <label className={styles.label} htmlFor="studyName">
            스터디 이름
          </label>
          <div className={FIELD_WRAP_CLASS}>
            <Input
              id="studyName"
              placeholder="스터디 이름을 입력해 주세요"
              value={studyName}
              onChange={e => setStudyName(e.target.value)}
              onBlur={e => validateField('studyName', e.target.value)}
              size="lg"
              style={{ width: '100%' }}
              aria-invalid={!!errors.studyName}
              aria-describedby={
                errors.studyName ? 'studyName-error' : undefined
              }
            />
          </div>
          <div className={styles.errorSlot}>
            {errors.studyName && (
              <p id="studyName-error" className={styles.error}>
                {errors.studyName}
              </p>
            )}
          </div>
        </section>

        {/* 소개 */}
        <section className={styles.section}>
          <label className={styles.label} htmlFor="description">
            소개
          </label>
          <div className={FIELD_WRAP_CLASS}>
            <textarea
              id="description"
              className={`${styles.inputReset} ${styles.textarea}`}
              placeholder="소개 멘트를 작성해 주세요"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>
          <div className={styles.errorSlot}></div>
        </section>

        {/* 배경 선택 */}
        <section className={styles.section}>
          <p className={styles.label}>배경을 선택해주세요</p>
          <div className={styles.grid}>
            {backgrounds.map(bg => {
              const selected = bg.id === selectedBgId;
              return (
                <button
                  key={bg.id}
                  type="button"
                  aria-pressed={selected}
                  className={`${styles.bgItem} ${selected ? styles.bgItemSelected : ''}`}
                  onClick={() => setSelectedBgId(bg.id)}
                  style={
                    bg.type === 'color' ? { backgroundColor: bg.value } : {}
                  }
                >
                  {bg.type === 'image' ? (
                    <img
                      className={styles.bgImg}
                      src={bg.value}
                      alt={bg.name || '배경 이미지'}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={styles.bgColor}
                      style={{ backgroundColor: bg.value }}
                      title={bg.name}
                    />
                  )}
                  {selected && (
                    <img
                      src={`${base}assets/icons/selected.svg`}
                      alt=""
                      aria-hidden
                      className={styles.checkIcon}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className={styles.errorSlot}></div>
        </section>

        {/* 비밀번호 */}
        <section className={styles.section}>
          <div className={FIELD_WRAP_CLASS}>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={e => validateField('password', e.target.value)}
              onSubmit={handleSubmit}
              placeholder="비밀번호를 입력해 주세요"
              label="비밀번호"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
          </div>
          <div className={styles.errorSlot}>
            {errors.password && (
              <p id="password-error" className={styles.error}>
                {errors.password}
              </p>
            )}
          </div>
        </section>

        {/* 비밀번호 확인 섹션 제거 */}

        {/* 공개 여부 */}
        <section className={styles.section}>
          <div className={styles.toggleRow}>
            <span id="publicLabel" className={styles.label}>
              스터디 공개 여부
            </span>
            <ToggleSwitch
              checked={isPublic}
              onChange={next => setIsPublic(!!next)}
              aria-labelledby="publicLabel"
            />
          </div>
          <div className={styles.errorSlot}></div>
        </section>

        {/* 취소/수정하기 버튼 */}
        <div className={styles.cta}>
          <div className={styles.buttonGroup}>
            <Button
              variant="secondary"
              size="md"
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate(`/study/${id}`)}
            >
              취소
            </Button>
            <Button
              variant="action"
              size="md"
              type="submit"
              className={styles.submitButton}
              disabled={submitting || !isFormValid}
            >
              {submitting ? '수정하는 중...' : '수정하기'}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
