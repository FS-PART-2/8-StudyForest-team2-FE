# StudyForest Frontend

## 기술 스택

- **프레임워크:** React
- **빌드 도구:** Vite
- **스타일링:** CSS
- **상태 관리:** justand
- **코드 품질:**
  - ESLint
  - Prettier

## 폴더 구조

```
src/
├── components/           # Atomic Design 패턴 적용
│   ├── atoms/           # 가장 작은 단위의 컴포넌트
│   ├── molecules/       # atoms를 조합한 컴포넌트
│   └── organisms/       # molecules를 조합한 큰 단위 컴포넌트
│       ├── Footer.jsx
│       ├── Header.jsx
│       └── Layout.jsx
├── hooks/               # 커스텀 훅
├── pages/               # 페이지 컴포넌트
├── store/               # 상태 관리 (justand)
├── styles/              # 스타일 파일
│   ├── common.css       # 공통 스타일
│   ├── reset.css       # 스타일 초기화
│   ├── components/     # 컴포넌트별 스타일
│   └── pages/          # 페이지별 스타일
├── utils/              # 유틸리티 함수
│   ├── api/           # API 관련 유틸리티
│   └── common/        # 공통 유틸리티
├── App.jsx             # 앱의 최상위 컴포넌트
└── main.jsx           # 앱의 진입점

public/                # 정적 파일
├── assets/
    ├── fonts/        # 폰트 파일
    ├── icons/        # 아이콘 파일
    └── images/       # 이미지 파일
```

## 주요 특징

- **Atomic Design**: 재사용 가능한 컴포넌트를 체계적으로 관리
- **모듈화된 스타일링**: 컴포넌트와 페이지별로 스타일을 분리하여 관리
- **API 모듈화**: API 호출 로직을 별도로 관리
- **상태 관리**: Redux를 통한 전역 상태 관리

## webhook 설정
- Github, discord 자동 메시지 설정
