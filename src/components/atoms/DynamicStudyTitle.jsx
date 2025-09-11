import { getNicknameColor } from '../../utils/getNicknameColor';

/**
 * 배경 이미지를 기준으로 닉네임 색상을 적용해 스터디 제목을 렌더링하는 컴포넌트.
 *
 * 주된 동작:
 * - backgroundImage로부터 닉네임 색상을 계산하여 닉네임에 적용합니다.
 * - studyName이 "<nickname>의 " 접두어로 시작하면 해당 접두어를 제거해 표시합니다.
 * - tag가 'h1'일 때(디테일 페이지) 한 줄로 닉네임 + '의' + 스터디명을 표시하고,
 *   그 외(카드 등)에는 닉네임 + '의'와 스터디명을 두 줄로 분리해 표시합니다.
 * - nickname 또는 studyName이 없으면 studyName 또는 '스터디'를 대체로 출력합니다.
 *
 * @param {Object} props
 * @param {string} props.nickname - 표시할 닉네임.
 * @param {string} props.studyName - 원본 스터디 이름(필요 시 nickname 접두어 제거).
 * @param {string} props.backgroundImage - 닉네임 색상 결정에 사용하는 배경 이미지 경로.
 * @param {string} [props.className] - 추가 CSS 클래스.
 * @param {string} [props.tag='h1'] - 사용할 HTML 태그; 'h1'이면 디테일 페이지 레이아웃을 사용.
 * @param {Object} [props.style] - 추가 인라인 스타일(컴포넌트 기본 스타일에 병합됨).
 * @returns {JSX.Element} 렌더링된 제목 요소.
 */
export default function DynamicStudyTitle({
  nickname,
  studyName,
  backgroundImage,
  className = '',
  tag: Tag = 'h1',
  style = {},
  ...props
}) {
  // 배경에 따른 닉네임 색상 결정
  const nicknameColor = getNicknameColor(backgroundImage);

  // 스터디 이름에서 닉네임 제거 (접두어만 안전하게 제거)
  const prefix = `${nickname}의 `;
  const cleanStudyName =
    typeof studyName === 'string' &&
    typeof nickname === 'string' &&
    studyName.startsWith(prefix)
      ? studyName.slice(prefix.length)
      : studyName;

  // 디테일 페이지인지 확인 (h1 태그이면 디테일 페이지)
  const isDetailPage = Tag === 'h1';

  return (
    <Tag
      className={className}
      style={{
        ...style,
        display: 'flex',
        flexDirection: isDetailPage ? 'row' : 'column',
        alignItems: isDetailPage ? 'center' : 'flex-start',
        lineHeight: '1.5',
        flexWrap: isDetailPage ? 'nowrap' : 'wrap',
      }}
      {...props}
    >
      {nickname && cleanStudyName ? (
        isDetailPage ? (
          // 디테일 페이지: 한 줄로 표시
          <>
            <span
              style={{
                color: nicknameColor,
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              {nickname}
            </span>
            <span
              style={{
                color: 'var(--black-black_414141, #414141)',
                display: 'inline-block',
                marginLeft: '0.5rem',
                marginRight: '0.5rem',
              }}
            >
              의
            </span>
            <span
              style={{
                color: 'var(--black-black_414141, #414141)',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {cleanStudyName}
            </span>
          </>
        ) : (
          // 카드 페이지: 두 줄로 표시
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span
                style={{
                  color: nicknameColor,
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}
              >
                {nickname}
              </span>
              <span
                style={{
                  color: 'var(--black-black_414141, #414141)',
                  display: 'inline-block',
                  marginLeft: '0.5rem',
                }}
              >
                의
              </span>
            </div>
            <span
              style={{
                color: 'var(--black-black_414141, #414141)',
                display: 'inline-block',
                marginTop: '0.2rem',
              }}
            >
              {cleanStudyName}
            </span>
          </>
        )
      ) : (
        cleanStudyName || '스터디'
      )}
    </Tag>
  );
}
