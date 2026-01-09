# 프로젝트 설정 가이드

## 1. Supabase 설정

### 1.1 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. 데이터베이스 비밀번호 설정

### 1.2 데이터베이스 테이블 생성
1. Supabase 대시보드에서 SQL Editor 열기
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행
3. 테이블 및 RLS 정책이 정상적으로 생성되었는지 확인

### 1.3 API 키 확인
1. Project Settings > API 메뉴 이동
2. 다음 정보 복사:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)

---

## 2. Google Sheets 설정

### 2.1 Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. API 및 서비스 > 라이브러리에서 "Google Sheets API" 검색 및 활성화

### 2.2 서비스 계정 생성
1. API 및 서비스 > 사용자 인증 정보
2. "사용자 인증 정보 만들기" > "서비스 계정" 선택
3. 서비스 계정 이름 입력 및 생성
4. 생성된 서비스 계정 클릭
5. 키 탭 > 키 추가 > JSON 형식으로 다운로드
6. JSON 파일에서 다음 정보 확인:
   - `client_email` (GOOGLE_SERVICE_ACCOUNT_EMAIL)
   - `private_key` (GOOGLE_PRIVATE_KEY)

### 2.3 Google Sheets 공유 설정
1. 신청 데이터를 저장할 Google Sheets 생성
2. 공유 버튼 클릭
3. 서비스 계정 이메일 추가 (편집자 권한)
4. Sheets URL에서 ID 확인:
   - `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - SHEET_ID 부분을 GOOGLE_SHEET_ID로 사용

---

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id
```

⚠️ **주의사항**:
- `GOOGLE_PRIVATE_KEY`는 반드시 따옴표로 감싸야 합니다
- 줄바꿈은 `\n`으로 표시됩니다
- 실제 키 값에서 따옴표를 제거하지 마세요

---

## 4. 로컬 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 5. Vercel 배포

### 6.1 GitHub 연동
1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com) 로그인
3. "Import Project" 선택
4. GitHub 저장소 연동

### 6.2 환경 변수 설정
1. Vercel 프로젝트 설정 > Environment Variables
2. `.env.local`의 모든 변수를 추가
3. Production, Preview, Development 환경 모두 체크

### 6.3 배포
- main 브랜치에 푸시하면 자동 배포
- 커밋마다 Preview 배포 생성

---

## 6. 테스트

### 6.1 기능 테스트
1. 참가 신청 폼 작성
2. 제출 후 다음 사항 확인:
   - Supabase 테이블에 데이터 저장 확인
   - Google Sheets에 데이터 추가 확인
   - 성공 페이지 정상 표시 확인

### 6.2 오류 처리 테스트
- 필수 항목 미입력 시 검증 메시지 확인
- 잘못된 전화번호 형식 입력 시 에러 메시지 확인
- 네트워크 오류 시 적절한 에러 처리 확인

---

## 7. 문제 해결

### Supabase 연결 오류
- 환경 변수가 정확한지 확인
- RLS 정책이 활성화되어 있는지 확인
- 네트워크 연결 확인

### Google Sheets 동기화 실패
- 서비스 계정이 Sheets에 편집자로 추가되었는지 확인
- GOOGLE_SHEET_ID가 정확한지 확인
- API 활성화 여부 확인

---

## 8. 보안 주의사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- Service Role Key는 서버 사이드에서만 사용하세요
- API 키는 정기적으로 갱신하세요
- RLS 정책을 적절히 설정하여 데이터 보안을 유지하세요
