# 2026 브릿지저스 겨울수련회 참가신청 시스템

청지기 - 청년이여, 지금 기도하라!

## 행사 정보
- **일시**: 2026년 2월 5일(목) ~ 2월 7일(토)
- **장소**: 경기 화성시 팔탄면 마당바위로 135-21, 청호인재개발원
- **주제말씀**: 마가복음 1:35

## 주요 기능
- ✅ 참가자 정보 입력 (이름, 또래, 성별, 마을, 연락처)
- ✅ 참석 유형 선택 (전일 참석 / 부분 참석)
- ✅ 이동 수단 및 출발/귀가 정보 입력
- ✅ 참가비 자동 계산 (얼리버드 / 본등록)
- ✅ Supabase 데이터베이스 저장
- ✅ Google Sheets 자동 동기화
- ✅ 모바일 최적화 UI

## 기술 스택
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadcnUI
- **Form Management**: React Hook Form + Zod
- **Database**: Supabase (PostgreSQL)
- **Integrations**: Google Sheets API, Naver SENS SMS API

## 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 필요한 값을 입력하세요.

#### Supabase 설정
1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. `supabase/schema.sql` 파일의 SQL을 실행하여 테이블 생성
3. Project Settings > API에서 URL과 Key 확인

#### Google Sheets 설정
1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성
2. Google Sheets API 활성화
3. 서비스 계정 생성 및 JSON 키 다운로드
4. 대상 Google Sheets에 서비스 계정 이메일을 편집자로 추가

#### Naver SENS SMS 설정
1. [Naver Cloud Platform](https://www.ncloud.com)에서 SMS 서비스 활성화
2. Service ID, Access Key, Secret Key 발급

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 4. 빌드 및 배포
```bash
npm run build
npm start
```

## 배포 (Vercel)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 Import
3. 환경 변수 설정 (`.env.local`의 모든 변수)
4. 배포 완료

## 프로젝트 구조

```
├── app/
│   ├── api/
│   │   └── register/
│   │       └── route.ts          # 신청 처리 API
│   ├── success/
│   │   └── page.tsx               # 신청 완료 페이지
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 메인 페이지
│   └── globals.css                # 글로벌 스타일
├── components/
│   ├── ui/                        # ShadcnUI 컴포넌트
│   └── registration-form.tsx      # 참가 신청 폼
├── lib/
│   ├── cost-calculator.ts         # 비용 계산 로직
│   ├── database.types.ts          # DB 타입 정의
│   ├── google-sheets.ts           # Google Sheets 연동
│   ├── naver-sms.ts               # Naver SMS 연동
│   ├── schemas.ts                 # Zod 스키마
│   ├── supabase.ts                # Supabase 클라이언트
│   └── utils.ts                   # 유틸리티
└── supabase/
    └── schema.sql                 # 데이터베이스 스키마

```

## 등록 기간 및 참가비

### 등록 기간
- **얼리버드**: 2026년 1월 18일(주일) ~ 1월 25일(주일)
- **본등록**: 2026년 1월 26일(월) ~ 2월 1일(주일)

### 참가비
- **전일 참석 (2박 3일)**
  - 얼리버드: 100,000원
  - 본등록: 120,000원
- **부분 참석**
  - 목요일: 50,000원
  - 금요일: 50,000원
  - 토요일: 20,000원

## 데이터베이스 스키마

주요 필드:
- 기본 정보: `name`, `age_group`, `gender`, `village`, `phone`, `requests`
- 참석 정보: `attendance_type`, `attendance_dates`, `transport_type`
- 이동 정보: `departure_info`, `return_info`
- 메타 정보: `total_cost`, `status`, `created_at`

자세한 내용은 `supabase/schema.sql` 참고

## 라이센스

이 프로젝트는 브릿지저스 청년부 내부 사용을 위한 것입니다.
