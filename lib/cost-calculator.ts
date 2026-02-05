/**
 * 참가비 계산 유틸리티
 * 
 * 등록 기간:
 * - 얼리버드: 2026년 1월 18일 ~ 1월 25일
 * - 본등록: 2026년 1월 26일 ~ 2월 1일
 * 
 * 참가비:
 * - 전일 참석 (2박3일): 얼리버드 100,000원 / 본등록 120,000원
 * - 부분 참석: 목요일 50,000원 / 금요일 50,000원 / 토요일 20,000원
 */

const EARLY_BIRD_START = new Date('2026-01-18T18:00:00+09:00');
const EARLY_BIRD_END = new Date('2026-01-25T23:59:59+09:00');
const REGISTRATION_END = new Date('2026-02-09T23:59:59+09:00');

// 참가비 상수
const COSTS = {
  FULL_EARLY_BIRD: 100000,
  FULL_REGULAR: 120000,
  DAY1: 50000, // 목요일
  DAY2: 50000, // 금요일
  DAY3: 20000, // 토요일
};

/**
 * 등록이 오픈되었는지 확인
 * 얼리버드 시작 시간과 동일
 */
/**
 * 등록 오픈 시간 가져오기
 * 얼리버드 시작 시간과 동일
 */
export function getRegistrationOpenTime(): Date {
  return EARLY_BIRD_START;
}

/**
 * 현재 날짜가 얼리버드 기간인지 확인
 */
export function isEarlyBird(date: Date = new Date()): boolean {
  return date >= EARLY_BIRD_START && date <= EARLY_BIRD_END;
}

/**
 * 현재 날짜가 등록 가능 기간인지 확인
 */
export function isRegistrationOpen(date: Date = new Date()): boolean {
  return date >= EARLY_BIRD_START && date <= REGISTRATION_END;
}

/**
 * 등록 기간 상태 반환
 */
export function getRegistrationPeriod(date: Date = new Date()): 'early-bird' | 'regular' | 'closed' {
  if (date < EARLY_BIRD_START) {
    return 'closed';
  }
  if (date <= EARLY_BIRD_END) {
    return 'early-bird';
  }
  if (date <= REGISTRATION_END) {
    return 'regular';
  }
  return 'closed';
}

/**
 * 전일 참석 비용 계산
 */
export function calculateFullAttendanceCost(date: Date = new Date()): number {
  return isEarlyBird(date) ? COSTS.FULL_EARLY_BIRD : COSTS.FULL_REGULAR;
}

/**
 * 부분 참석 비용 계산
 * @param days 선택한 날짜 배열 (예: ['day1', 'day2'])
 */
export function calculatePartialAttendanceCost(days: string[]): number {
  let total = 0;

  if (days.includes('day1')) {
    total += COSTS.DAY1;
  }
  if (days.includes('day2')) {
    total += COSTS.DAY2;
  }
  if (days.includes('day3')) {
    total += COSTS.DAY3;
  }

  return total;
}

/**
 * 참가비 계산 (전일/부분 자동 판단)
 */
export function calculateTotalCost(
  attendanceType: 'full' | 'partial',
  attendanceDates?: string[],
  registrationDate: Date = new Date()
): number {
  if (attendanceType === 'full') {
    return calculateFullAttendanceCost(registrationDate);
  }

  if (!attendanceDates || attendanceDates.length === 0) {
    return 0;
  }

  return calculatePartialAttendanceCost(attendanceDates);
}

/**
 * 금액을 한국 통화 형식으로 포맷
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}
