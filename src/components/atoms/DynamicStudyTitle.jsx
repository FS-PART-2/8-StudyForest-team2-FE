import { getNicknameColor } from '../../ui/getNicknameColor';

/**
 * DynamicStudyTitle Atom 컴포넌트
 * 배경에 따라 닉네임 색상이 동적으로 변경되는 스터디 제목 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.nickname - 닉네임
 * @param {string} props.studyName - 스터디 이름
 * @param {string} props.backgroundImage - 배경 이미지 경로 (닉네임 색상 결정용)
 * @param {string} props.className - 추가 CSS 클래스
 * @param {string} props.tag - HTML 태그 (기본값: 'h1')
 * @param {Object} props.style - 추가 인라인 스타일
 * @param {boolean} props.isOneLine - 한 줄 표시 여부 (기본값: false, 두 줄)
 * @returns {JSX.Element}
 */
export default function DynamicStudyTitle({
  nickname,
  studyName,
  backgroundImage,
  className = '',
  tag: Tag = 'h1',
  style = {},
  isOneLine = false,
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

  // 한 줄 표시 여부 결정
  // 1. isOneLine prop이 명시적으로 true인 경우
  // 2. h1 태그인 경우 (디테일 페이지)
  // 3. style에 whiteSpace: 'nowrap'이 있는 경우
  const shouldShowOneLine =
    isOneLine || Tag === 'h1' || (style && style.whiteSpace === 'nowrap');

  return (
    <Tag
      className={className}
      style={{
        ...style,
        display: 'flex',
        flexDirection: shouldShowOneLine ? 'row' : 'column',
        alignItems: shouldShowOneLine ? 'center' : 'flex-start',
        lineHeight: '1.5',
        flexWrap: shouldShowOneLine ? 'nowrap' : 'wrap',
      }}
      {...props}
    >
      {nickname && cleanStudyName ? (
        shouldShowOneLine ? (
          // 한 줄로 표시 (디테일 페이지 또는 모달)
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
