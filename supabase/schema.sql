-- 2026 브릿지저스 겨울수련회 참가 신청 테이블

CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 기본 정보
  name VARCHAR(100) NOT NULL,
  age_group VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  village VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  requests TEXT,
  
  -- 참석 정보
  attendance_type VARCHAR(20) NOT NULL CHECK (attendance_type IN ('full', 'partial')),
  attendance_dates TEXT[], -- ['day1', 'day2', 'day3'] 형식
  
  -- 이동 수단 및 출발/귀가 정보
  transport_type VARCHAR(50) NOT NULL,
  departure_info TEXT,
  return_info TEXT,
  
  -- 비용 및 상태
  total_cost INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
);

-- 인덱스 생성 (검색 최적화)
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_village ON registrations(village);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 데이터를 삽입할 수 있도록 허용 (공개 신청 폼)
CREATE POLICY "Anyone can insert registrations"
  ON registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 읽기는 인증된 사용자만 가능 (관리자 전용)
CREATE POLICY "Only authenticated users can read registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- 코멘트 추가
COMMENT ON TABLE registrations IS '브릿지저스 겨울수련회 참가 신청 데이터';
COMMENT ON COLUMN registrations.attendance_type IS 'full: 전일 참석 (2박3일), partial: 부분 참석';
COMMENT ON COLUMN registrations.attendance_dates IS '부분 참석 시 선택한 날짜 배열 (예: ["day1", "day2"])';
